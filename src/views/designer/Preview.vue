<script setup lang="ts">

import { h, ref, resolveComponent, VNode } from 'vue'
import { Component } from '@/views/designer/service/component'
import { renderPageStore } from '@/stores/constant'

const renderPage = renderPageStore
const state =  ref(eval(renderPage.value?.state!)())

function doRender (node: Component): VNode | undefined {
  let resolve = resolveComponent(node.type)
  if (node.visible) {
    if (node.children.length > 0) {
      return h(resolve, {
        state: state.value,
        component: node,
        id: node.id,
      }, () => {
        return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
      })
    } else {
      return h(resolve as any, {
        state: state.value,
        component: node,
        id: node.id,
      }, { default: () => h('div', { class: 'bg-gray-200 p-10px select-none' }, '拖拽组件或模板到这里') })
    }
  }
}

const componentRender = () => {
  if (renderPage.value && state.value) {
    return doRender(renderPage.value?.component)
  } else {
    return h('div')
  }
}

const componentModel = () => {
  return h('div', {}, renderPage.value?.models.map(m => doRender(m)))
}

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style scoped>
</style>
