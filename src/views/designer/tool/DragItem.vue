<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import { isDragging, startDrag, x, y } from '@/views/designer/common'
import { useDraggable } from '@vueuse/core'

const dragStyle = computed(() => {
  return {
    left: x.value - 20 + 'px',
    top: y.value - 10 + 'px',
  }
})

</script>


<template>
  <div
      v-if="isDragging"
      id="drag-item"
      :style="dragStyle"
      class="fixed bg-gray-500 w-auto px-40px z-1000 pointer-events-auto select-none cursor-move"
  ><p class="text-sm z-1000">名称</p>
  </div>
</template>

<style scoped>

</style>
