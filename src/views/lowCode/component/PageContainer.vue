<script setup lang="ts">

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

</script>

<template>
  <el-container class="space-y-6 min-h-100vh !bg-transparent !flex-col p-20px">
    <slot></slot>
  </el-container>
</template>
