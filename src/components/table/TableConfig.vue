<script lang="ts" setup>
import { computed, Ref } from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { getProp, usePropsWatcher } from '@/views/designer/propsWatcher'
import { Switch } from '@element-plus/icons-vue'
import ArrayConfig from '@/views/designer/config/ArrayConfig.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'

import { ValueType } from '@/views/lowCode/service'
import Item from '@/views/designer/config/panel/Item.vue'
import ItemContainer from '@/views/designer/config/panel/ItemContainer.vue'
import ItemHeader from '@/views/designer/config/panel/ItemHeader.vue'
import PropValueSetter from '@/views/designer/config/panel/PropValueSetter.vue'
import PanelContainer from '@/views/designer/config/panel/PanelContainer.vue'

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

</script>

<template>
  <PanelContainer>
    <div>
      <ItemHeader>
        <ItemLabel>行配置</ItemLabel>
        <PropValueSetter :prop="config.columns"></PropValueSetter>
      </ItemHeader>
      <ArrayConfig :columns="columns">
        <template #header>
          <ItemLabel>标题</ItemLabel>
          <ItemLabel>类型</ItemLabel>
        </template>
        <template #columns="{index}">
          <el-input v-model="columns[index].title"></el-input>
          <el-input v-model="columns[index].type"></el-input>
        </template>
        <template #detail="{index}">
          <ItemContainer>
            <Item>
              <ItemLabel :width="70">标题</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="columns[index].title"></el-input>
              </div>
            </Item>
            <Item>
              <ItemLabel :width="70">类型</ItemLabel>
              <div class="flex-grow">
                <el-select v-model="columns[index].type" class="w-full"></el-select>
              </div>
            </Item>
            <Item>
              <ItemLabel :width="70">字段key</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="columns[index].key"></el-input>
              </div>
            </Item>
          </ItemContainer>
        </template>
      </ArrayConfig>
    </div>

    <div>
      <ItemHeader>
        <ItemLabel>行数据配置</ItemLabel>
        <PropValueSetter :prop="config.rowData"></PropValueSetter>
      </ItemHeader>
      <ArrayConfig :columns="rowData">
        <template #header>
          <ItemLabel v-for="(column,idx) in columns.slice(0,2)" :key="idx">{{ column.title }}</ItemLabel>
        </template>
        <template #columns="{index}">
          <el-input v-for="(column) in columns.slice(0,2)" v-model="rowData[index][column.key]"></el-input>
        </template>
        <template #detail="{index}">
          <ItemContainer>
            <Item v-for="(column,idx) in columns" :key="idx">
              <ItemLabel :width="70">{{ column.title }}({{ column.key }})</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="rowData[index][column.key]"></el-input>
              </div>
            </Item>
          </ItemContainer>
        </template>
      </ArrayConfig>
    </div>
  </PanelContainer>


</template>

<style scoped>

</style>
