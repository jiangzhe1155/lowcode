<script setup lang="ts">

import { computed, ref } from 'vue'
import { x, y } from '@/views/designer/common'
import { useDraggable } from '@vueuse/core'

const dragStyle = computed(() => {
  return {
    left: x.value + 'px',
    top: y.value + 'px',
  }
})
const el = ref<HTMLElement | null>(null)

// `style` will be a helper computed for `left: ?px; top: ?px;`
const { style } = useDraggable(el, {
  initialValue: { x: x.value, y: y.value },
})

</script>


<template>
  <!--      v-if="x && y"-->

  <div
      ref="el"
      :style="style"
      class="fixed bg-gray-500 w-auto px-40px z-4000 pointer-events-auto select-none cursor-move "
  ><p class="text-sm">名称</p>
  </div>
</template>

<style scoped>

</style>
