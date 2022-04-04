<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import { emitter, nodeState, onDragEnd, onStartSelect } from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'
import { onLongPress, useMousePressed } from '@vueuse/core'

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
  nodeState.asideHoverType = props.type
}

const el = ref<HTMLElement | null>(null)
const longPressed = ref(false)

onLongPress(el, () => {
  longPressed.value = true
  nodeState.pressTypeId = props.type
  onStartSelect()
  emitter.emit('onComponentPanelClose')
}, { delay: 200 })

const { pressed } = useMousePressed({ target: el })

watch(pressed, (n) => {
  if (n) {

  } else {
    onDragEnd()
    longPressed.value = false
    emitter.emit('onComponentPanelOpen')
  }
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
