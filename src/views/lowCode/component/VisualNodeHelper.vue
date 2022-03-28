<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useElementHover } from '@vueuse/core'

defineProps({
  location: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    default: '虚拟边框'
  }
})

const myHoverableElement = ref()
const isHovered = useElementHover(myHoverableElement)

</script>

<template>
  <div
      ref="myHoverableElement"
      :class="['absolute',{'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25':isHovered}]"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}">
    <p v-if="isHovered" class="absolute -top-20px text-blue-400 text-sm">{{ name }}</p>
  </div>
</template>

<style>

</style>
