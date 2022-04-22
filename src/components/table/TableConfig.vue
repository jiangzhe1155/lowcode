<script setup lang="ts">
import { computed, Ref} from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { getProp, usePropsWatcher } from '@/views/designer/propsWatcher'
import { Delete, EditPen, Operation } from '@element-plus/icons-vue'
import ArrayConfig from '@/views/designer/config/ArrayConfig.vue'
import draggable from 'vuedraggable'

const props = defineProps<{
  component: Ref<Table>
}>()

const { config } = usePropsWatcher(() => new TableProp(), props.component)

const rowData = computed(() => {
  return getProp(config.value.rowData)
})

const columns = computed(() => {
  return getProp(config.value.columns)
})

const onRowDelete = (rows: [], idx: number) => {
  rows.splice(idx, 1)
}

</script>

<template>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="24">
      <div class="text-sm text-left">行配置</div>
    </el-col>
  </el-row>

  <ArrayConfig :columns="columns">
    <template #columns="{index}">
      <el-input v-model="columns[index].title"></el-input>
      <el-input v-model="columns[index].type"></el-input>
    </template>
    <template #detail="{index}">
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2">
          <span class="w-70px">标题</span>
          <div class="flex-grow">
            <el-input v-model="columns[index].title"></el-input>
          </div>
        </div>
        <div class="flex items-center gap-x-2">
          <span class="w-70px">类型</span>
          <div class="flex-grow">
            <el-select class="w-full" v-model="columns[index].type"></el-select>
          </div>
        </div>
        <div class="flex items-center gap-x-2">
          <span class="w-70px">字段key</span>
          <div class="flex-grow">
            <el-input v-model="columns[index].key"></el-input>
          </div>
        </div>
      </div>
    </template>
  </ArrayConfig>

  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="24">
      <div class="text-sm text-left">行数据配置</div>
    </el-col>
  </el-row>

  <ArrayConfig :columns="rowData">
    <template #columns="{index}">
      <el-input v-for="(column) in columns.slice(0,2)" v-model="rowData[index][column.key]"></el-input>
    </template>
    <template #detail="{index}">
      <div class="flex flex-col gap-y-2">
        <div class="flex items-center gap-x-2" v-for="(column,idx) in columns" :key="idx">
          <span class="w-70px">{{ column.title }}({{ column.key }})</span>
          <div class="flex-grow">
            <el-input v-model="rowData[index][column.key]"></el-input>
          </div>
        </div>
      </div>
    </template>
  </ArrayConfig>
</template>

<style scoped>

</style>
