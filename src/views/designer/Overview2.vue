<script setup lang="ts">

import { computed, h, onMounted, ref, resolveComponent, VNode } from 'vue'
import { Component } from '@/views/lowCode/service'
import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { RenderPage } from '@/views/designer/common'

const renderPage = ref<RenderPage>()

function doRender (node: any): VNode | undefined {
  const resolve = resolveComponent(node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
    })
  }
}

const componentRender = () => {
  if (renderPage.value) {
    return doRender(renderPage.value?.component)
  } else {
    return h('div')
  }
}

const componentModel = () => {
  return h('div', {}, renderPage.value?.models.map(m => doRender(m)))
}

addMessageListener('render', (payload: any) => {
  console.log('接收到变化', renderPage.value)
  renderPage.value = payload.renderPage
})

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style scoped>
</style>
