<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { usePropsWatcher } from '@/views/designer/propsWatcher'
import { Delete, EditPen,Operation } from '@element-plus/icons-vue'

const props = defineProps<{
  component: Ref<Table>
}>()

const config = ref(new TableProp())
usePropsWatcher(config, props.component)

const rowData = computed(()=>{
  let rowData = config.value.rowData
  if (!rowData) {
    return
  }
  return rowData.options[rowData.idx]
})


const columns = computed(()=>{
  let columns =  config.value.columns
  if (!columns) {
    return
  }
  return columns.options[columns.idx]
})

</script>

<template>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="24">
      <div class="text-sm text-left">行数据</div>
    </el-col>
  </el-row>
  <div class="flex flex-col !mx-12px">
    <div class="flex gap-x-1">
      <div class="w-16px"></div>
      <div class="flex-grow text-left">标题</div>
      <div class="flex-grow text-left">类型</div>
      <div class="w-16px"></div>
    </div>

    <draggable :list="columns"
               tag="transition-group"
               handle=".handle"
               item-key="index">
      <template #item="{element,index}">
        <div class="flex gap-x-1 items-center">
          <el-popover
              placement="left"
              :width="360"
              trigger="click"
          ><template #reference>
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
                  <div class="flex-grow"><el-input v-model="columns[index].title"></el-input></div>
                </div>
                <div class="flex items-center gap-x-2">
                  <span class="w-70px">类型</span>
                  <div class="flex-grow"><el-select class="w-full" v-model="columns[index].type"></el-select></div>
                </div>
                <div class="flex items-center gap-x-2">
                  <span class="w-70px">字段key</span>
                  <div class="flex-grow"><el-input v-model="columns[index].key"></el-input></div>
                </div>
              </div>
            </div>
          </el-popover>
          <el-input size="small" v-model="columns[index].title"></el-input>
          <el-input size="small" v-model="columns[index].type"></el-input>
          <el-button type="text">
            <el-icon :size="16">
              <Delete/>
            </el-icon>
          </el-button>
          <el-button type="text" class="!ml-0 handle" >
            <el-icon :size="16">
              <Operation/>
            </el-icon>
          </el-button>
        </div>
      </template>
    </draggable>

<!--    <draggable v-model="columns">-->
<!--      <transition-group>-->

<!--      </transition-group>-->
<!--    </draggable>-->
  </div>


</template>

<script lang="ts">
import draggable from 'vuedraggable'

export default {
  name:'TableConfig',
  components:{
    draggable
  }
}
</script>

<style scoped>
</style>
