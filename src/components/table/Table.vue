<script setup lang="ts">
import { Table } from '@/views/designer/interface/component'
import { computed } from 'vue'

const props = defineProps<{
  component: Table,
  state: any
}>()

const rowData = computed(() => {
  let rowData = props.component.props.rowData
  if (!rowData) {
    return
  }

  return rowData.options[rowData.idx]
})

const columns = computed(() => {
  let columns = props.component.props.columns
  if (!columns) {
    return
  }
  return columns.options[columns.idx]
})

</script>

<template>
  <el-table :data="rowData" style="width: 100%">
    <el-table-column
        v-for="(column,idx) in columns" :key="idx"
        :prop="column.key"
        :label="column.title"/>
  </el-table>
</template>

<style scoped>

</style>
