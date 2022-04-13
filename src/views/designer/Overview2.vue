<script setup lang="ts">


import {
  computed,
  createApp,
  createVNode,
  getCurrentInstance,
  h,
  onMounted,
  reactive,
  render,
  resolveComponent,
  VNode
} from 'vue'
import { Card, Component, Dialog, Page, Root } from '@/views/lowCode/service'

function doRender (node: any): VNode | undefined {
  const resolve = resolveComponent(node.type)
  console.log(resolve, node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
    })
  }
}

let page = new Page()
let card = new Card('卡片1')
card.children.push(new Card('卡片2'))
page.children.push(new Card('卡片3'), card, new Card('卡片4'))
let dialog = new Dialog()
dialog.children.push(new Card('卡片6'))
let root = new Root()
root.children.push(page, new Card('卡片7'), dialog)
const renderPage: Component = reactive(root)

const componentRender = computed(() => {
  // 2.渲染对话框
  return h('div', { class: '!min-h-100vh flex !flex-col' }, doRender(renderPage))
})
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import { app } from '@/main'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'


onMounted(() => {
  // let elementById = document.getElementById('app')
  // let node = doRender(renderPage)
  // node!.appContext = app._context
  // render(node!, elementById)
})
</script>

<template>
  <!--  <componentRender></componentRender>-->
</template>

<style scoped>

</style>
