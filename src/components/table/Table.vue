<script setup lang="ts">
import { Table } from '@/views/designer/interface/component'
import { computed, ref } from 'vue'
import { getProp } from '@/views/designer/propsWatcher'
import { Column } from '@/components/table/ColumnType'
import Item from '@/views/designer/config/panel/Item.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'

const props = defineProps<{
  component: Table,
  state: any
}>()

const rowData = computed(() => {
  return getProp(props.component.props.rowData)
})

const columns  = computed((): Column[] => {
  return getProp(props.component.props.columns)
})

const searchFilter = ref({})

const searchColumn = computed(() => {
  return columns.value.filter(c=>c.search)
})

const filterRowCount = ref(4)

</script>

<template>
  <div>
    <div  class="p-20px">
      <div class="grid gap-y-4" :class="'grid-cols-'+filterRowCount">
        <div v-for="(column,idx) in ((parseInt(searchColumn.length / filterRowCount) + 1) * filterRowCount - 1)" :key="idx" >
          <Item v-if="idx < searchColumn.length">
            <ItemLabel fixed class="!text-right">{{searchColumn[idx].title}}</ItemLabel>
            <el-input v-if="searchColumn[idx].type ==='input'" v-model="searchFilter[searchColumn[idx].key]"></el-input>
          </Item>
        </div>
        <div class="order-last text-right">
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </div>
      </div>
    </div>

    <el-table :data="rowData" style="width: 100%">
      <el-table-column
          v-for="(column,idx) in columns.filter(c=>!c.hidden)" :key="idx"
          :prop="column.key"
          :label="column.title"/>
    </el-table>
    <el-pagination class="mt-20px" background
                   layout="total,sizes, prev, pager, next"
                   :total="1000"
    ></el-pagination>
  </div>

</template>

<style scoped>

</style>
