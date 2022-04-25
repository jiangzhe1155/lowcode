<script setup lang="ts">

import { computed } from 'vue'
import { locationState, isDragging, isShowInsertion } from '@/views/designer/service/common'

const dragInsertionStyle = computed(() => {
  let {
    top,
    width,
    height,
    left
  } = locationState.currentInsertionComponent?.location!
  let direction = locationState.direction

  left = direction === 'right' ? left + width - 4 : left
  top = direction === 'bottom' ? top + height - 4 : top
  width = direction === 'right' || direction === 'left' ? 4 : width
  height = direction === 'top' || direction === 'bottom' ? 4 : height

  return {
    width: width + 'px',
    height: height + 'px',
    left: left + 'px',
    top: top + 'px'
  }
})
</script>


<template>
  <div
      v-if="isDragging && isShowInsertion"
      class="absolute"
      :class="{'bg-blue-500':locationState.direction !== 'center',
           'bg-blue-600 bg-opacity-50':locationState.direction === 'center',
        }"
      :style="dragInsertionStyle"
  >
  </div>
</template>

<style scoped>

</style>
