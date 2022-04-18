<script setup lang="ts">

import { h, ref, resolveComponent, VNode } from 'vue'
import { addMessageListener } from '@/views/lowCode/iframeUtil'
import { RenderPage } from '@/views/designer/common'

const renderPage = ref<RenderPage>()
const state = ref()

function doRender (node: any): VNode | undefined {
  const resolve = resolveComponent(node.type)
  if (node.visible) {
    return h(resolve, {
      state: state,
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
    })
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
  state.value = eval(renderPage.value?.state!)()
})

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style scoped>
</style>
