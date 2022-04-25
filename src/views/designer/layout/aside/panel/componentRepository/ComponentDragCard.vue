<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { emitter, onComponentDragEnd } from '@/views/designer/service/common'
import { ComponentGroup, ComponentType } from '@/views/designer/service/service'
import { asideComponentType, asideComponentGroup, x, y, startDrag } from '@/views/designer/service/common'
import { onDocumentMouseDrag, onDocumentMouseDragEnd } from '@/views/designer/service/windowEvent'

const props = defineProps<{
  type: ComponentType,
  group: ComponentGroup,
  name: string,
  imgUrl: string,
}>()

const el = ref<HTMLElement | null>()
const timer = ref()
useEventListener(el, 'mousedown', (e) => {
  console.log('鼠标按下了')
  timer.value = setTimeout(() => {
    if (!timer.value) {
      return
    }
    console.log('开始监听鼠标事件')
    asideComponentType.value = props.type
    asideComponentGroup.value = props.group
    startDrag.value = true
    document.addEventListener('mousemove', onDocumentMouseDrag, true)
    document.addEventListener('mouseup', onDocumentMouseDragEnd, true)
    emitter.emit('onComponentPanelClose')
  }, 200,) as unknown as number
}, true)

useEventListener(el, 'mouseup', (e) => {
  console.log('鼠标抬起了了')
  clearTimeout(timer.value)
  timer.value = null
  onComponentDragEnd()
}, true)



</script>

<template>
  <el-card ref="el" class="h-full select-none " shadow="hover">
    <el-image :src="imgUrl" class="w-56px h-56px" @dragstart.prevent>
    </el-image>
    <p>{{ name }}</p>
  </el-card>
</template>

<style scoped>

</style>
