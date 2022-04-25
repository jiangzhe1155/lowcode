<script setup lang="ts">

import { computed, onMounted, ref } from 'vue'
import { isDragging, x, y, locationState, componentMap } from '@/views/designer/service/common'

const dragStyle = computed(() => {
  return {
    left: x.value - 20 + 'px',
    top: y.value - 10 + 'px',
  }
})
</script>


<template>
  <div
      v-if="isDragging && locationState.currentPressComponent"
      id="drag-item"
      :style="dragStyle"
      class="fixed bg-gray-500 w-auto px-40px z-1000 pointer-events-auto select-none cursor-move"
  ><p class="text-sm z-1000 cursor-move">{{ componentMap.get(locationState.currentPressComponent?.id)?.name }}</p>
  </div>
</template>
<style scoped>

</style>
