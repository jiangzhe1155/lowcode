<script setup lang="ts">

const props = defineProps({
  component: {
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
