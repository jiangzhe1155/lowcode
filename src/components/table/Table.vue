<script lang="ts" setup>
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

const columns = computed((): Column[] => {
  return getProp(props.component.props.columns)
})

const operations = computed((): any[] => {
  return getProp(props.component.props.operations)
})

const searchFilter = ref({})
const searchColumn = computed(() => {
  return columns.value.filter(c => c.search)
})

const filterRowCount = ref(6)

const onEdit = (row) => {
  console.log(row)
}

const onDelete = (row) => {
  console.log(row)
}

const onClickRow = (row, idx) => {
  eval(operations.value[idx].onclick)(row)
}

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
    <div class="flex gap-x-2 my-20px">
      <el-button type="primary">新建</el-button>
      <el-button type="danger">批量删除</el-button>
    </div>
    <el-table :data="rowData" style="width: 100%">
      <el-table-column
          v-for="(column,idx) in columns.filter(c=>!c.hidden)" :key="idx"
          :label="column.title"
          :prop="column.key"/>
      <el-table-column fixed="right" label="操作" width="120">
        <div class="flex gap-x-2">
          <div v-for="(operation,idx) in operations" :key="idx">
            <el-button type="text" @click="onClickRow(scope.row,idx)" v-if="!operation.confirm">
              {{ operation.label }}
            </el-button>
            <el-popconfirm
                :title="'确认'+operation.label">
              <template #reference>
                <el-button type="text" @click="onClickRow(scope.row,idx)" v-if="operation.confirm">
                  {{ operation.label }}
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>

      </el-table-column>
    </el-table>
    <el-pagination :total="1000" background
                   class="mt-20px"
                   layout="total,sizes, prev, pager, next"
    ></el-pagination>
  </div>

</template>

<style scoped>

</style>
