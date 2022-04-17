<script setup lang="ts">
import { computed } from 'vue'
import {
  copy, deleteComponent,
  fetchLocation,
  hide,
  iframeWin,
  locationState,
  renderPage,
  scrollToTarget, show
} from '@/views/designer/common'
import { Component } from '@/views/lowCode/service'
import { CopyDocument, Delete, Lock, Hide, View } from '@element-plus/icons-vue'

const defaultProps = {
  children: 'children',
  label: 'name',
}

const renderTree = computed(() => {
  let page = renderPage.value
  let root = Object.assign({}, page.component)
  root.children = [...page.models, ...root.children]
  return [root]
})

const handleNodeClick = (data: Component) => {
  console.log(data)
  locationState.currentClickComponent = fetchLocation(data.id)
  console.log('点击位置', locationState.currentClickComponent?.location, iframeWin().scrollY)
  scrollToTarget(locationState.currentClickComponent?.location!)
}

const onCopy = (component: Component, e: Event) => {
  let copyId = copy(component.id)
  setTimeout(() => {
    locationState.currentClickComponent = fetchLocation(copyId)
  }, 200)
  e.preventDefault()
  e.stopPropagation()
}

const onHide = (component: Component, e: Event) => {
  hide(component.id)
  locationState.currentClickComponent = undefined
  e.preventDefault()
  e.stopPropagation()
}

const onShow = (component: Component, e: Event) => {
  show(component.id)
  locationState.currentClickComponent = undefined
  e.preventDefault()
  e.stopPropagation()
}

const onDelete = (component: Component, e: Event) => {
  console.log('删除', component, e)
  deleteComponent(component.id)
  locationState.currentClickComponent = undefined
  e.preventDefault()
  e.stopPropagation()
}

</script>

<template>
  <div class="container">
      <el-tree :data="renderTree"
               :props="defaultProps"
               @node-click="handleNodeClick"
               :expand-on-click-node="false"
               default-expand-all>
        <template #default="{ node, data }">
      <span
          class="flex flex-1 items-center justify-between"
      ><span>{{ node.label }}</span>
        <span>
          <el-button-group class="mr-10px !space-x-1" size="large" type="text" v-if="data.group !== 'Root'">
            <el-button>
              <el-icon :size="16">
                <lock/>
              </el-icon>
            </el-button>
            <el-button @click="onCopy(data,$event)">
              <el-icon :size="16">
                <copy-document/>
              </el-icon>
            </el-button>
            <el-button v-if="data.visible" @click="onHide(data,$event)">
              <el-icon :size="16">
                <Hide/>
              </el-icon>
            </el-button>
            <el-button v-if="!data.visible" @click="onShow(data,$event)">
              <el-icon :size="16">
                <View/>
              </el-icon>
            </el-button>
            <el-button @click="onDelete(data,$event)">
              <el-icon :size="16">
                <delete/>
              </el-icon>
            </el-button>
          </el-button-group>
        </span>
      </span>
        </template>
      </el-tree>
  </div>

</template>

<style scoped>

</style>
