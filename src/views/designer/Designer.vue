<script setup lang="ts">
import Aside from '@/views/designer/layout/aside/Aside.vue'
import PropsPanel from '@/views/designer/layout/operationArea/PropsPanel.vue'

import { designerConfig } from '@/stores/constant'
import DragComponentDetecting from '@/views/designer/layout/detection/DragComponentDetecting.vue'
import AddComponentDetecting from '@/views/designer/layout/detection/AddComponentDetecting.vue'
import Header from '@/views/designer/layout/header/Header.vue'
import Canvas from '@/views/designer/layout/canvas/Canvas.vue'

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="designerConfig.headerHeight+'px'">
      <Header></Header>
    </el-header>
    <el-container>
      <DragComponentDetecting></DragComponentDetecting>
      <AddComponentDetecting></AddComponentDetecting>
      <Aside></Aside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <Canvas></Canvas>
      </el-main>
      <el-aside class="border-l-1" width="400px">
        <PropsPanel></PropsPanel>
      </el-aside>
    </el-container>
  </el-container>
</template>

<style >
::-webkit-scrollbar {
  width: 5px;
  height: 14px;
}

::-webkit-scrollbar-thumb {
  background-color: #b6b6b6;
}
</style>
