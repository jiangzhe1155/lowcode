<script setup lang="ts">
import { defineProps, onMounted, ref, toRaw, watch } from 'vue'
import { vElementHover } from '@vueuse/components'
import { onLongPress, useMousePressed } from '@vueuse/core'
import { asideHoverType, controlState, emitter, iframeRef, iframeWin, locationState, x, y } from '@/views/lowCode/state'
import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { ComponentGroup, ComponentType } from '@/views/lowCode/service'

const props = defineProps<{
  type: ComponentType,
  group: ComponentGroup,
  name: string,
  imgUrl: string,
}>()

const el = ref<HTMLElement | null>(null)

onLongPress(el, () => {
  controlState.value.isLongPress = true
  controlState.value.asideComponentType = props.type
  controlState.value.asideComponentGroup = props.group
  emitter.emit('onComponentPanelClose')
}, { delay: 200 })

const { pressed } = useMousePressed({ target: el })
watch(pressed, (n) => {
  if (n) {

  } else {
    controlState.value.isDrag = false
    controlState.value.isLongPress = false
    controlState.value.asideComponentGroup = undefined
    controlState.value.asideComponentType = undefined
    sendIframeMessage(iframeWin.value, 'onDragEnd', {})
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
