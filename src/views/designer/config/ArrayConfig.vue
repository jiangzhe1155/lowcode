<script setup lang="ts">
import draggable from 'vuedraggable'
import { Delete, EditPen, FolderAdd, Operation, Plus } from '@element-plus/icons-vue'

const props = defineProps<{
  columns: any[]
}>()

const onRowDelete = (rows: [], idx: number) => {
  rows.splice(idx, 1)
}

const onAddItem = () => {
  props.columns.push({})
}

</script>

<template>
  <div class="flex flex-col !mx-12px select-none">
    <div class="flex gap-x-1 items-end">
      <div class="w-16px"></div>
      <span class="flex-grow text-left">标题</span>
      <span class="flex-grow text-left">类型</span>
      <div class="w-16px"></div>
      <div class="w-16px"></div>
    </div>

    <draggable :list="columns"
               handle=".handle"
               ghost-class="ghost"
               item-key="index"
    ><template #item="{element,index}">
      <div class="mt-5px">
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
              <slot name="detail" v-bind:element="element" v-bind:index="index"></slot>
            </div>
          </el-popover>
          <slot name="columns" v-bind:element="element" v-bind:index="index"></slot>
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
      </div>
      </template>
    </draggable>
    <el-button class="!mt-10px" size="small" @click="onAddItem"><el-icon ><Plus/></el-icon>添加一项</el-button>
  </div>

</template>

<style scoped>
.ghost {
  background: #c8ebfb;
}
</style>
