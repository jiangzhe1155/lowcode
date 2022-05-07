<script lang="ts" setup>
import { Table } from '@/views/designer/service/component'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { getProp } from '@/views/designer/service/propsWatcher'
import { Column } from '@/components/table/ColumnType'
import Item from '@/views/designer/config/panel/Item.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'
import Button from '@/components/button/Button.vue'

const props = defineProps<{
  component: Table,
  state: any,
  ctx: any
}>()

const rowData = computed(() => {
  let res = getProp(props.component.props.rowData)
  let idx = props.component.props.rowData.idx
  if (idx === 'array') {
    return res
  } else if (idx === 'variable') {
    try {
      return eval(`props.state.${res}`)
    } catch (e) {
    }
  }
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

const self = props.ctx[props.component.id]

onBeforeMount(() => {
  setTimeout(() => {
    props.state.title = 'aaaaaa'
  }, 1000)
})

const handleSizeChange = () => {
  props.state.dataMap.run()
}

const handleCurrentChange = () => {
  props.state.dataMap.run()
}

</script>

<template>
  <div>
    <div>
      <div :class="gridStyle" class="grid gap-y-4">
        <div v-for="(idx) in ((parseInt(searchColumn.length / filterRowCount) + 1) * filterRowCount - 1)"
             :key="idx">
          <Item v-if="idx <= searchColumn.length">
            <ItemLabel class="!text-right" fixed>{{ searchColumn[idx - 1].title }}</ItemLabel>
            <el-input v-if="searchColumn[idx-1].type ==='input'"
                      v-model="searchFilter[searchColumn[idx-1].key]"></el-input>
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

    <el-table v-loading="state.dataMap.loading" :data="rowData" style="width: 100%">
      <el-table-column v-for=" (column,idx) in columns.filter(c=>!c.hidden)" :key="idx" :label="column.title"
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
    <el-pagination v-model:currentPage="self.pageNo"
                   v-model:page-size="self.pageSize"
                   :page-sizes="[10, 50, 100]"
                   :total="self.total"
                   background
                   class="mt-20px"
                   layout="total,sizes, prev, pager, next"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"/>
  </div>

</template>

<style scoped>

</style>
