<script setup lang="ts">
import { ref } from 'vue'
import ComponentDragCard from '@/views/designer/layout/aside/panel/componentRepository/ComponentDragCard.vue'

const activeNames = ref(['container', 'layout', 'model'])

</script>

<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="container">
      <template #title>
        <p class="pl-20px">容器</p>
      </template>
      <el-row :gutter="0">
        <el-col :span="8">
          <ComponentDragCard
              name="容器"
              img-url="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg"
              type="Root" group="Container">
          </ComponentDragCard>
        </el-col>
        <el-col :span="8">
          <ComponentDragCard name="页面" img-url="https://tianshu.alicdn.com/429f9a1d-3856-4e5c-8a9c-3013860c9708.png"
                             type="Page" group="Container"></ComponentDragCard>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </el-collapse-item>

    <el-collapse-item name="layout">
      <template #title>
        <p class="pl-20px">基础组件</p>
      </template>
      <el-row>
        <el-col :span="8">
          <ComponentDragCard name="卡片"
                             img-url="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg"
                             type="Card" group="Container"></ComponentDragCard>
        </el-col>
        <el-col :span="8">
          <ComponentDragCard name="表格"
                             img-url="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg"
                             type="Table" group="Input"></ComponentDragCard>
        </el-col>
      </el-row>
    </el-collapse-item>

    <el-collapse-item name="model">
      <template #title>
        <p class="pl-20px">模态框</p>
      </template>
      <el-row>
        <el-col :span="8">
          <ComponentDragCard name="对话框"
                             img-url="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg"
                             type="Dialog" group="Model"></ComponentDragCard>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
:deep(.el-collapse-item__content) {
  padding-bottom: 0;
}

</style>
