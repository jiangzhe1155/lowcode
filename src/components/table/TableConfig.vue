<script lang="ts" setup>
import { computed, Ref } from 'vue'
import {
  Table, TableProp
} from '@/views/designer/interface/component'
import { getProp, usePropsWatcher } from '@/views/designer/propsWatcher'
import ArrayConfig from '@/views/designer/config/ArrayConfig.vue'
import ItemLabel from '@/views/designer/config/panel/ItemLabel.vue'

import Item from '@/views/designer/config/panel/Item.vue'
import ItemContainer from '@/views/designer/config/panel/ItemContainer.vue'
import ItemHeader from '@/views/designer/config/panel/ItemHeader.vue'
import PropValueSetter from '@/views/designer/config/panel/PropValueSetter.vue'
import PanelContainer from '@/views/designer/config/panel/PanelContainer.vue'
import { columnTypes } from '@/components/table/ColumnType'

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

const operations = computed(() => {
  return getProp(config.value.operations)
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
          <ItemLabel>key</ItemLabel>
        </template>
        <template #columns="{index}">
          <el-input v-model="columns[index].title"></el-input>
          <el-input v-model="columns[index].key"></el-input>
        </template>
        <template #detail="{index}">
          <ItemContainer>
            <Item>
              <ItemLabel fixed>标题</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="columns[index].title"></el-input>
              </div>
            </Item>
            <Item>
              <ItemLabel fixed>字段key</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="columns[index].key"></el-input>
              </div>
            </Item>
            <Item>
              <ItemLabel fixed>类型</ItemLabel>
              <div class="flex-grow">
                <el-select v-model="columns[index].type" class="w-full" default-first-option>
                  <el-option
                      v-for="item in columnTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  />
                </el-select>
              </div>
            </Item>
            <Item>
              <ItemLabel fixed>隐藏</ItemLabel>
              <div class="flex-grow">
                <el-switch v-model="columns[index].hidden"></el-switch>
              </div>
            </Item>
            <Item>
              <ItemLabel fixed>启用搜索</ItemLabel>
              <div class="flex-grow">
                <el-switch v-model="columns[index].search"></el-switch>
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
              <ItemLabel fixed>{{ column.title }}({{ column.key }})</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="rowData[index][column.key]"></el-input>
              </div>
            </Item>
          </ItemContainer>
        </template>
      </ArrayConfig>
    </div>

    <div>
      <ItemHeader>
        <ItemLabel>操作列配置</ItemLabel>
        <PropValueSetter :prop="config.operations"></PropValueSetter>
      </ItemHeader>
      <ArrayConfig :columns="operations">
        <template #header>
          <ItemLabel>名称</ItemLabel>
          <ItemLabel>二次确认</ItemLabel>
        </template>
        <template #columns="{index}">
          <el-input v-model="operations[index].label"></el-input>
          <el-switch v-model="operations[index].confirm" class="w-full"></el-switch>
        </template>
        <template #detail="{index}">
          <ItemContainer>
            <Item>
              <ItemLabel fixed>名称</ItemLabel>
              <div class="flex-grow">
                <el-input v-model="operations[index].label"></el-input>
              </div>
            </Item>
            <Item>
              <ItemLabel fixed>二次确认</ItemLabel>
              <div class="flex-grow">
                <el-switch v-model="operations[index].confirm"></el-switch>
              </div>
            </Item>
            {{ operations[index].onclick }}
            <Item>
              <ItemLabel fixed>点击事件</ItemLabel>
              <div class="flex-grow">
                <el-input :rows="2"
                          type="textarea"
                          v-model="operations[index].onclick"></el-input>
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
