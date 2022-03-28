<script setup lang="ts">
import { ref } from 'vue'

const activeNames = ref(['container', 'layout'])
</script>

<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="container">
      <template #title>
        <p class="pl-20px">容器</p>
      </template>
      <el-row :gutter="0">
        <el-col :span="8">
          <el-card shadow="hover" class="h-full">
            <el-image class="w-56px h-56px"
                      src="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg">
            </el-image>
            <p>行列容器</p>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="h-full">
            <el-image class="w-56px h-56px" src="https://tianshu.alicdn.com/429f9a1d-3856-4e5c-8a9c-3013860c9708.png">
            </el-image>
            <p>页面</p>
          </el-card>
        </el-col>
        <el-col :span="8"></el-col>
      </el-row>
    </el-collapse-item>
    <el-collapse-item name="layout">
      <template #title>
        <p class="pl-20px">基础组件</p>
      </template>
      <el-row :gutter="0">
        <el-col :span="8">
          <el-card shadow="hover" class="h-full">
            <el-image class="w-56px h-56px"
                      src="https://img.alicdn.com/imgextra/i2/O1CN01B1NMW926IFrFxjqQT_!!6000000007638-55-tps-56-56.svg">
            </el-image>
            <p>卡片</p>
          </el-card>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<style scoped>
/deep/ .el-collapse-item__content {
  padding-bottom: 0;
}
</style>
