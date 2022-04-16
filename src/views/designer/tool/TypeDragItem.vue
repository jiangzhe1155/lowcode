<script setup lang="ts">

import { computed } from 'vue'
import { x, y, asideComponentType } from '@/views/designer/common'

const asideDragStyle = computed(() => {
  return {
    left: x.value - 20 + 'px',
    top: y.value - 10 + 'px',
  }
})
</script>


<template>
  <div
      v-if="asideComponentType"
      class="fixed bg-gray-500 w-auto px-40px z-1000  pointer-events-none	select-auto	cursor-move"
      :style="asideDragStyle"
  ><p class="text-sm cursor-move">{{ asideComponentType }}</p>
  </div>
</template>

<style scoped>

</style>
