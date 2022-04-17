<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  copy, deleteComponent,
  fetchLocation,
  hide,
  iframeWin,
  locationState,
  renderPage,
  scrollToTarget, show, updateComponentName
} from '@/views/designer/common'
import { Component } from '@/views/lowCode/service'
import { CopyDocument, Delete, Lock, Hide, View } from '@element-plus/icons-vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'

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

const updateComponentId = ref()
const updateName = ref()
const onDbClick = (id: string, name: string) => {
  updateComponentId.value = id
  updateName.value = name
  console.log('双击了')
  setTimeout(() => {
    document.getElementById('treeInput' + id)?.select()
  })
}

const onUpdateNameBlur = () => {
  console.log('失去焦点')
  if (updateComponentId) {
    updateComponentName(updateComponentId.value, updateName.value)
  }
  updateComponentId.value = undefined
  updateName.value = undefined
}

const onHover = (id: string) => {
  locationState.currentHoverComponent = fetchLocation(id)
}
const onLeave = () => {
  locationState.currentHoverComponent = undefined
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
        <el-input
            :id="'treeInput' + data.id"
            v-if="updateComponentId === data.id"
            class="!border-blue-500"
            v-model="updateName"
            @blur="onUpdateNameBlur"
            @keyup.enter.native="onUpdateNameBlur"
            size="small">
        </el-input>
        <span class="flex flex-1 items-center justify-between w-full"
              v-on:dblclick="onDbClick(data.id,data.name)"
              v-if="updateComponentId !== data.id"
              @mouseover="onHover(data.id)"
              @mouseleave="onLeave"
        >
        <span class="select-none">{{ node.label }}</span>
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
