<script lang="ts" setup>

import { h, ref, resolveComponent, VNode } from 'vue'
import { addMessageListener } from '@/views/designer/service/iframeUtil'
import { RenderPage, resetLocationState } from '@/views/designer/service/common'
import { Component } from '@/views/designer/service/component'
import { useResizeObserver } from '@vueuse/core'

const renderPage = ref<RenderPage>()
const state = ref()

function doRender (node: Component): VNode | undefined {
  let resolve = resolveComponent(node.type)
  let el = ref()
  useResizeObserver(el, (entries) => {
      resetLocationState()
  })
  if (node.visible) {
    if (node.children.length > 0) {
      return h(resolve, {
        ref: el,
        state: state.value,
        component: node,
        id: node.id
      }, () => {
        return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
      })
    } else {
      return h(resolve as any, {
        ref: el,
        state: state.value,
        component: node,
        id: node.id
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

addMessageListener('render', (payload: any) => {
  renderPage.value = payload.renderPage
  if (state.value == null) {
    state.value = eval(renderPage.value?.state!)()
  }
})

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style>


</style>
