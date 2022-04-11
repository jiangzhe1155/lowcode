<script setup lang="ts">
import { defineProps, onMounted, ref, toRaw, watch } from 'vue'
import { vElementHover } from '@vueuse/components'
import { onLongPress, useMousePressed } from '@vueuse/core'
import { asideHoverType, controlState, emitter, iframeWin, locationState, x, y } from '@/views/lowCode/state'
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
  },group: {
    type: String,
    require: true,
    default: ''
  }
})


const el = ref<HTMLElement | null>(null)
const longPressed = ref(false)
const isDrag = ref(false)

onLongPress(el, () => {
  longPressed.value = true
  emitter.emit('onComponentPanelClose')
}, { delay: 200 })

const { pressed } = useMousePressed({ target: el })

watch(pressed, (n) => {
  if (n) {

  } else {
    longPressed.value = false
    emitter.emit('onComponentPanelOpen')
  }
})

onMounted(() => {
  window.addEventListener('mousemove', (event: MouseEvent) => {
    if (longPressed.value) {
      if (!isDrag.value) {
        isDrag.value = true
        sendIframeMessage(iframeWin.value, 'onStartDrag', {
          componentType: props.type,
          componentGroup: props.group
        })
      }
    }
  }, { passive: true })

  window.addEventListener('mouseup', (event: MouseEvent) => {
    isDrag.value = false
    longPressed.value = false
    sendIframeMessage(iframeWin.value, 'onDragEnd', {})
  }, { passive: true })

  addMessageListener('onDragEnd', () => {
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
