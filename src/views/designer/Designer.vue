<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import {
  createApp, createVNode,
  h,
  onMounted,
  ref,
  render,
  resolveComponent,
  VNode, watch,
  watchEffect
} from 'vue'
import { Card, Component, Dialog, Page, Root, useRenderPageData } from '@/views/lowCode/service'
import { app } from '@/main'
import { ElButton } from 'element-plus'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'

const store = useConfigStore()

let iframeWin: Window
let iframeDoc: Document

document.addEventListener('mousemove', (e: MouseEvent) => {
})

const {
  renderPage
} = useRenderPageData('123213213')

watchEffect(() => {
  let doc = iframeWin?.document
  let body = doc?.body

  if (body) {
    const containerId = 'app'
    let container = doc.getElementById(containerId)
    if (!container) {
      container = doc.createElement('div')
      doc.body.appendChild(container)
      container.id = containerId
    }

    const vnode = doRender(renderPage)
    vnode!.appContext = app._context

    if (vnode && container) {
      render(vnode, container)
    }
  }
})
let componentType = new Map()

function doRender (node: any): VNode | undefined {
  const resolve = componentType.get(node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
    })
  }
}

onMounted(() => {

  iframeWin = document.getElementById('workbench-iframe')?.contentWindow


  iframeDoc = iframeWin.document

  // 加载所有的组件
  componentType.set('PageContainer', resolveComponent('PageContainer'))
  componentType.set('CardComponent', resolveComponent('CardComponent'))
  componentType.set('RootContainer', resolveComponent('RootContainer'))
  componentType.set('DialogComponent', resolveComponent('DialogComponent'))
})

const onLoad = () => {
  let doc = iframeWin?.document
  let body = doc?.body
  if (body) {
    const containerId = 'app'
    let container = doc.getElementById(containerId)
    if (!container) {
      container = doc.createElement('div')
      doc.body.appendChild(container)
      container.id = containerId
    }
    const vnode = doRender(renderPage)
    vnode!.appContext = app._context
    if (vnode && container) {
      render(vnode, container)
    }
  }
}

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      <el-button></el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div

                class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <!--              <VisualNodeHelper>-->
              <!--              </VisualNodeHelper>-->
            </div>
            <iframe
                id="workbench-iframe"
                class="h-full w-full" name="Overview"
                @load="onLoad"

                src="http://localhost:3000/#/lowCode/overview2">
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">123213</el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
