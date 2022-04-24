<script setup lang="ts">

import { computed } from 'vue'
import { locationState,componentMap } from '@/views/designer/common'

const hoverStyle = computed(() => {
  let location = locationState.currentHoverComponent?.location
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
      v-if="locationState.currentHoverComponent && locationState.currentHoverComponent.id !== locationState.currentClickComponent?.id"
      class="absolute border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25"
      :style="hoverStyle">
    <div>
      <p class="absolute -top-20px text-blue-300 text-sm">
        {{componentMap.get(locationState.currentHoverComponent.id).name}}
      </p>
    </div>
  </div>
</template>

<style scoped>

</style>
