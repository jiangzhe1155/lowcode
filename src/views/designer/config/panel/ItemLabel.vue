<script setup lang="ts">
const props = defineProps<{
  fixed?:boolean
}>()

</script>

<template>
  <span class="text-sm text-left break-words" :class="[props.fixed? `w-70px` :'flex-grow' ]"><slot></slot></span>
</template>

<style scoped>

</style>
