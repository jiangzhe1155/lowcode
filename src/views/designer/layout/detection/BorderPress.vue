<script setup lang="ts">

import { computed } from 'vue'
import { locationState,isDragging } from '@/views/designer/service/common'


const pressStyleCompute = computed(() => {
  let location = locationState.currentPressComponent?.location
  return {
    width: location?.width + 'px',
    height: location?.height + 'px',
    left: location?.left + 'px',
    top: location?.top + 'px'
  }
})

</script>

<template>
  <div
      v-if="isDragging"
      class="absolute bg-gray-400 bg-opacity-50 select-none"
      :style="pressStyleCompute"
  >
  </div>
</template>

<style scoped>

</style>
