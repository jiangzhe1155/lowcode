<script setup lang="ts">

import { Ref, ref } from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { usePropsWatcher } from '@/views/designer/propsWatcher'
import { Delete, EditPen } from '@element-plus/icons-vue'

const props = defineProps<{
  component: Ref<Table>
}>()

const config = ref(new TableProp())
usePropsWatcher(config, props.component)


</script>

<template>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="24">
      <div class="text-sm text-left">行数据</div>
    </el-col>

  </el-row>
  <div class="flex-grow text-left">娃哈哈</div>
  <div class="flex flex-col !mx-12px">
    <div class="flex gap-x-1 items-center">
      <el-button type="text">
        <el-icon>
          <edit-pen/>
        </el-icon>
      </el-button>

      <el-input size="small"></el-input>

      <el-input size="small"></el-input>

      <el-button type="text">
        <el-icon>
          <Delete/>
        </el-icon>
      </el-button>
    </div>

    <div class="flex">
      <div>编辑</div>
    </div>
  </div>


</template>

<style scoped>
</style>
