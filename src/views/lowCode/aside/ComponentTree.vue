<script setup lang="ts">
import { computed } from 'vue'
import { fetchLocation, iframeWin, locationState, renderPage, scrollToTarget } from '@/views/designer/common'
import { Component } from '@/views/lowCode/service'

const defaultProps = {
  children: 'children',
  label: 'name',
}

const renderTree = computed(()=>{
  let page = renderPage.value
  let root = Object.assign({},page.component)
  root.children = [...page.models,...root.children]
  return [root];
})


const handleNodeClick = (data: Component)=>{
  console.log(data)
  locationState.currentClickComponent = fetchLocation(data.id)
  console.log('点击位置',locationState.currentClickComponent?.location,iframeWin().scrollY)

    scrollToTarget(locationState.currentClickComponent!.location!)


}

</script>

<template>
  <el-tree :data="renderTree" :props="defaultProps" @node-click="handleNodeClick" :expand-on-click-node="false"/>
</template>

<style scoped>

</style>
