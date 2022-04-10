<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, onUpdated, reactive, ref, watch, watchEffect } from 'vue'
import { onLongPress, useElementBounding, useMousePressed, useScroll, UseScrollReturn } from '@vueuse/core'
import {
  add,
  emitter,
  locationMap, move,
  nodeState,
  nodeStateOnHover, onCopy, onDelete,
  onDragEnd,
  onStartSelect, x, y
} from '@/views/lowCode/workbenchStatusMange'


const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

</script>

<template>
  <div class="!min-h-100vh flex !flex-col">
    <slot></slot>
  </div>
</template>
