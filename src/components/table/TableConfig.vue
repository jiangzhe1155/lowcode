<script setup lang="ts">
import { computed, Ref} from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { getProp, usePropsWatcher } from '@/views/designer/propsWatcher'
import { Delete, EditPen, Operation } from '@element-plus/icons-vue'

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

  <div class="flex flex-col !mx-12px select-none">
    <div class="flex gap-x-1">
      <div class="w-16px"></div>
      <div class="flex-grow text-left">标题</div>
      <div class="flex-grow text-left">类型</div>
      <div class="w-16px"></div>
      <div class="w-16px"></div>
    </div>

    <draggable :list="columns"
               tag="transition-group"
               handle=".handle"
               ghost-class="ghost"
               item-key="index">
      <template #item="{element,index}">
        <div class="flex gap-x-1 items-center">
          <el-popover
              placement="left"
              :width="360"
              :title="`第${index}项`"
              trigger="click"
          >
            <template #reference>
              <el-button type="text">
                <el-icon :size="16">
                  <edit-pen/>
                </el-icon>
              </el-button>
            </template>
            <div class="container p-20px">
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
            </div>
          </el-popover>
          <el-input size="small" v-model="columns[index].title"></el-input>
          <el-input size="small" v-model="columns[index].type"></el-input>
          <el-button type="text" @click="onRowDelete(columns,index)">
            <el-icon :size="16">
              <Delete/>
            </el-icon>
          </el-button>
          <el-button type="text" class="!ml-0 handle !cursor-move">
            <el-icon :size="16">
              <Operation/>
            </el-icon>
          </el-button>
        </div>
      </template>
    </draggable>
  </div>

  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="24">
      <div class="text-sm text-left">行数据配置</div>
    </el-col>
  </el-row>
  <div class="flex flex-col !mx-12px">
    <div class="flex gap-x-1">
      <div class="w-16px"></div>
      <div class="flex-grow text-left" v-for="(column,idx) in columns" :key="idx">{{ column.title }}</div>
      <div class="w-16px"></div>
      <div class="w-16px"></div>
    </div>

    <draggable :list="rowData"
               handle=".handle"
               ghost-class="ghost"
               item-key="index">
      <template #item="{element,index}">
        <div class="flex gap-x-1 items-center">
          <el-popover
              placement="left"
              :width="360"
              :title="`第${index}项`"
              trigger="click"
          >
            <template #reference>
              <el-button type="text">
                <el-icon :size="16">
                  <edit-pen/>
                </el-icon>
              </el-button>
            </template>
            <div class="container p-20px">
              <div class="flex flex-col gap-y-2">
                <div class="flex items-center gap-x-2" v-for="(column,idx) in columns" :key="idx">
                  <span class="w-70px">{{ column.title }}({{ column.key }})</span>
                  <div class="flex-grow">
                    <el-input v-model="rowData[index][column.key]"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </el-popover>
          <el-input size="small" v-for="(column) in columns" v-model="rowData[index][column.key]"></el-input>
          <el-button type="text" @click="onRowDelete(rowData,index)">
            <el-icon :size="16">
              <Delete/>
            </el-icon>
          </el-button>
          <el-button type="text" class="!ml-0 handle !cursor-move">
            <el-icon :size="16">
              <Operation/>
            </el-icon>
          </el-button>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import draggable from 'vuedraggable'

export default {
  name: 'TableConfig',
  components: {
    draggable
  }
}
</script>

<style scoped>
.ghost {
  background: #c8ebfb;
}
</style>
