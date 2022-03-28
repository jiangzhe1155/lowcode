<script setup lang="ts">
import { defineProps } from 'vue'

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

</script>

<template>
  <div
      class="absolute border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}">
    <p class="absolute -top-20px text-blue-400 text-sm">{{ name }}</p>
  </div>
</template>

<style>

</style>
