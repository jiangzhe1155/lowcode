<script setup lang="ts">
import { Indexable } from '@/views/designer/interface/component'

const props = defineProps<{
  prop: Indexable,
}>()
</script>

<template>
    <el-input v-if="prop.idx === 'variable'" v-model="prop.options[prop.idx]">
      <template #prepend>bind:</template>
    </el-input>
</template>

<style scoped>

</style>
