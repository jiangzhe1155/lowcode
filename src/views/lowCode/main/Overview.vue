<script setup lang="ts">
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'
import { onMounted, ref, toRaw, watch, watchEffect } from 'vue'
import {
  nodeState, onDrag,
  onDragEnd,
  onStartSelect,
  x,
  y
} from '@/views/lowCode/workbenchStatusMange'
import { onLongPress, useMousePressed, useScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const { pressed } = useMousePressed({ target: el })
const longPressed = ref(false)

onLongPress(el, () => {
  longPressed.value = true
  console.log('长按了')
  onStartSelect()
}, { delay: 200 })

watch(pressed, (n) => {
  if (n) {

  } else {
    console.log('长按结束了')
    onDragEnd()
    longPressed.value = false
  }
})

const onCLick = (event) => {
  console.log('点击了')
  window.parent.postMessage(
      {
        type: 'onClick'
      }, '*')
}

</script>

<template>

<!--  {{longPressed}} {{pressed}} {{x}} {{y}}-->
  <OperationPanel ref="el" @click="onCLick($event)">
  </OperationPanel>
</template>
<style scoped>

</style>
