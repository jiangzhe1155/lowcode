<script setup lang="ts">
import { computed, h, onMounted, ref, render, resolveComponent, VNode } from 'vue'
import { Component } from '@/views/lowCode/service'
import { addMessageListener } from '@/views/lowCode/iframeUtil'

const renderPage = ref<Component>()

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

const componentRender = computed(() => {
  console.log('componentRender',renderPage.value)
  if (renderPage.value) {
    return doRender(renderPage.value)
  } else {
    return h('div')
  }
})

addMessageListener('render', (payload: any) => {
  console.log('接收到')
  renderPage.value = payload.renderPage
})

</script>

<template>
  <componentRender/>
</template>

<style scoped>

</style>
