<script lang="ts" setup>
import { Table } from '@/views/designer/service/component'
import { computed, onMounted, ref } from 'vue'
import { getProp } from '@/views/designer/service/propsWatcher'
import { Column } from '@/components/table/ColumnType'
import Item from '@/views/designer/config/panel/Item.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'
import Button from '@/components/button/Button.vue'
import axios from 'axios'

const props = defineProps<{
  component: Table,
  state: any
}>()

const rowData = computed(() => {
  return getProp(props.component.props.rowData)
})

const columns = computed((): Column[] => {
  return getProp(props.component.props.columns)
})

const toolbars = computed((): any[] => {
  return getProp(props.component.props.toolbars)
})

const operations = computed((): any[] => {
  return getProp(props.component.props.operations)
})

const searchFilter = ref({})
const searchColumn = computed(() => {
  return columns.value.filter(c => c.search)
})

const filterRowCount = ref(6)

const gridStyle = computed(() => {
  if (filterRowCount.value == 3) {
    return 'grid-cols-3'
  }
  if (filterRowCount.value == 4) {
    return 'grid-cols-4'
  }
  if (filterRowCount.value == 5) {
    return 'grid-cols-5'
  }
  if (filterRowCount.value == 6) {
    return 'grid-cols-6'
  }
})

onMounted(async () => {
  let { data } = await axios.get(`/api/getUsers`, {})
  console.log('表格初始化', props.state, data)
  props.state.value.userList = data.data
})


</script>

<template>
  <div>
    <div>
      <div :class="gridStyle" class="grid gap-y-4">
        <div v-for="(column,idx) in ((parseInt(searchColumn.length / filterRowCount) + 1) * filterRowCount - 1)"
             :key="idx">
          <Item v-if="idx < searchColumn.length">
            <ItemLabel class="!text-right" fixed>{{ searchColumn[idx].title }}</ItemLabel>
            <el-input v-if="searchColumn[idx].type ==='input'" v-model="searchFilter[searchColumn[idx].key]"></el-input>
          </Item>
        </div>
        <div class="order-last text-right">
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </div>
      </div>
    </div>
    <div class="flex my-20px">
      <Button v-for="(toolbar,idx) in toolbars" :key="idx"
              :component="toolbar"
              :state="state">
      </Button>
    </div>

    <el-table :data="state.value.userList" style="width: 100%">
      <el-table-column
          v-for="(column,idx) in columns.filter(c=>!c.hidden)" :key="idx"
          :label="column.title"
          :prop="column.key"/>

      <el-table-column label="操作" width="120">
        <template #default="{row}">
          <div class="flex gap-x-2">
            <div v-for="(operation,idx) in operations" :key="idx">
              <Button :component="operation" :payload="[row,idx]" :state="state"></Button>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination :total="1000" background
                   class="mt-20px"
                   layout="total,sizes, prev, pager, next"/>
  </div>

</template>

<style scoped>

</style>
