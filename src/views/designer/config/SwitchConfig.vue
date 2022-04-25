<script setup lang="ts">
import { Indexable } from '@/views/designer/service/component'
const props = defineProps<{
  prop: Indexable,
}>()
</script>

<template>
  <el-switch v-if="prop.idx === 'boolean'" class="float-left" v-model="prop.options[prop.idx]"/>
</template>

<style scoped>

</style>
