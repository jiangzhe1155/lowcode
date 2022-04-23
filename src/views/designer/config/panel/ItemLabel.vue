<script setup lang="ts">
const props = defineProps<{
  width?:number
}>()

</script>

<template>
  <span class="text-sm text-left" :class="[props.width? `w-${props.width}px` :'flex-grow' ]"><slot></slot></span>
</template>

<style scoped>

</style>
