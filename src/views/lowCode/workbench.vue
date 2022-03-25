<script setup lang="ts">
import LowCodeAside from './aside/lowCodeAside.vue'
import { useConfigStore } from '/src/stores/constant'

const store = useConfigStore();
</script>
<template>
  <el-container class="h-screen">
    <el-header class="border-b-2" :height="store.headerHeight+'px'">
      aaaa
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200">
        <el-card class="!bg-gray-100 h-full">
        </el-card>
      </el-main>
      <el-aside class="border-l-1">右侧边栏</el-aside>
    </el-container>
  </el-container>
</template>

<script lang="ts">
export default {
  name: 'WorkBench'
}
</script>

<style scoped>

</style>
