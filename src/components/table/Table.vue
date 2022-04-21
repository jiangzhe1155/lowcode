<script setup lang="ts">
import { Table } from '@/views/designer/interface/component'

const props = defineProps<{
  component: Table,
  state: any
}>()

</script>

<template>
  <el-table :data="[]" style="width: 100%">
    <el-table-column
        v-for="(column) in component.props.columns.options[component.props.columns.idx]"
        :prop="column.title"
        :label="column.title"/>
  </el-table>
</template>

<style scoped>

</style>
