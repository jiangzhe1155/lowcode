<script setup lang="ts">

import { nodeState, nodeStateOnClick, renderPage } from '@/views/lowCode/workbenchStatusMange'
import { computed, h, resolveComponent, watch, getCurrentInstance, onUpdated } from 'vue'

let { ctx: that } = getCurrentInstance()

const render = computed(() => {
  function doRender (node: any) {
    const resolve = resolveComponent(node.type)
    return h(resolve, { element: node }, () => {
      return node.children.map((e: any) => doRender(e))
    })
  }
  return doRender(renderPage.root)
})
</script>

<template>
  <render></render>
<!--  <el-row :gutter="20" >-->
<!--    <el-col :span="4" ><div class="!bg-red-500">2</div></el-col>-->
<!--    <el-col :span="10" ><div class="!bg-gray-500">2</div></el-col>-->
<!--    <el-col>3</el-col>-->
<!--  </el-row>-->
</template>
<style scoped>

</style>
