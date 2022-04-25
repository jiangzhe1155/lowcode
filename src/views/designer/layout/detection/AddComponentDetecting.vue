<script setup lang="ts">

import { computed } from 'vue'
import { x, y, asideComponentType, isDragging } from '@/views/designer/service/common'

const asideDragStyle = computed(() => {
  return {
    left: x.value - 20 + 'px',
    top: y.value - 10 + 'px',
  }
})
</script>


<template>
  <div
      v-if="asideComponentType && isDragging"
      class="fixed bg-gray-500 w-auto px-40px z-1000 pointer-events-auto	select-none	cursor-move"
      :style="asideDragStyle"
  ><p class="text-sm">{{ asideComponentType }}</p>
  </div>
</template>

<style scoped>

</style>
