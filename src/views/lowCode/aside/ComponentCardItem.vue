<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import { onLongPress, useMousePressed } from '@vueuse/core'
import { emitter } from '@/views/lowCode/state'
import { ComponentGroup, ComponentType } from '@/views/lowCode/service'
import { asideComponentType, asideComponentGroup, x, y, iframeDoc, startDrag } from '@/views/designer/common'
import { onDocumentMouseDrag, onDocumentMouseDragEnd } from '@/views/designer/windowEvent'

const props = defineProps<{
  type: ComponentType,
  group: ComponentGroup,
  name: string,
  imgUrl: string,
}>()

const el = ref<HTMLElement | null>(null)

onLongPress(el, () => {
  asideComponentType.value = props.type
  asideComponentGroup.value = props.group
  startDrag.value = true
  emitter.emit('onComponentPanelClose')

  document.addEventListener('mousemove',onDocumentMouseDrag,true)
  document.addEventListener('mouseup',onDocumentMouseDragEnd,true)
}, { delay: 0 })

const { pressed } = useMousePressed({ target: el })
watch(pressed, (n) => {
  if (n) {

  } else {
    console.log('按压结束')
    asideComponentType.value = undefined
    asideComponentGroup.value = undefined
    startDrag.value = false

    emitter.emit('onComponentPanelOpen')
  }
})

</script>

<template>
  <el-card ref="el" shadow="hover" class="h-full">
    <el-image class="w-56px h-56px"
              :src="imgUrl">
    </el-image>
    <p>{{ name }}</p>
  </el-card>
</template>

<style scoped>

</style>
