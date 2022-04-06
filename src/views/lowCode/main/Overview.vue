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

const onCLick = () => {
  console.log('点击事件')
  window.parent.postMessage(
      {
        type: 'onClick',
      }, '*')
}


</script>

<template>
  <!--  {{longPressed}} {{pressed}} {{x}} {{y}}-->
  <OperationPanel @click="onCLick">
  </OperationPanel>
</template>
<style scoped>

</style>
