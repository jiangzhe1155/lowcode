<script setup lang="ts">

import { ref } from 'vue'



const props = defineProps<{
  component: {

  }
}>()

const prop = ref(props.component)
</script>

<template>
  <div>{{ prop.name }}</div>
</template>

<style scoped>

</style>
