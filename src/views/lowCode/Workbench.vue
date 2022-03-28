<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'

const store = useConfigStore()
</script>
<template>
  <el-container class="h-screen">
    <el-header class="border-b-2" :height="store.headerHeight+'px'">
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200">
        <div class="!bg-gray-100 h-full shadow border-solid border-1">
          <OperationPanel>
          </OperationPanel>
        </div>
      </el-main>
      <el-aside class="border-l-1">右侧边栏</el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
