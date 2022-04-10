<script setup lang="ts">
import { defineProps, onMounted, ref, toRaw, watch } from 'vue'
import { emitter } from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'
import { onLongPress, useMousePressed } from '@vueuse/core'
import { asideHoverType, controlState, iframeWin, locationState, x, y } from '@/views/lowCode/state'
import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'

const props = defineProps({
  name: {
    type: String,
    require: true,
    default: null
  },
  imgUrl: {
    type: String,
    require: true,
    default: ''
  },
  type: {
    type: String,
    require: true,
    default: ''
  }
})

function onHover (state: boolean) {
}

const el = ref<HTMLElement | null>(null)
const longPressed = ref(false)
const isDrag = ref(false)

onLongPress(el, () => {
  longPressed.value = true
  asideHoverType.value = props.type
  emitter.emit('onComponentPanelClose')
}, { delay: 200 })

const { pressed } = useMousePressed({ target: el })

watch(pressed, (n) => {
  if (n) {

  } else {
    longPressed.value = false
    asideHoverType.value = null
    emitter.emit('onComponentPanelOpen')
  }
})

onMounted(() => {
  window.addEventListener('mousemove', (event: MouseEvent) => {
    if (longPressed.value) {
      if (!isDrag.value) {
        isDrag.value = true
        sendIframeMessage(iframeWin.value, 'onStartDrag', {
          componentType: asideHoverType.value
        })
      }
    }
  }, { passive: true })

  window.addEventListener('mouseup', (event: MouseEvent) => {
    isDrag.value = false
    longPressed.value = false;

    sendIframeMessage(iframeWin.value, 'onDragEnd', {})
  }, { passive: true })

  addMessageListener('onDragEnd', (payload) => {
    longPressed.value = false
    emitter.emit('onComponentPanelOpen')
  })

})

</script>

<template>
  <el-card ref="el" shadow="hover" class="h-full" v-element-hover="onHover">
    <el-image class="w-56px h-56px"
              :src="imgUrl">
    </el-image>
    <p>{{ name }}</p>
  </el-card>
</template>

<style scoped>

</style>
