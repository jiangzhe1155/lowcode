<script setup lang="ts">

import { computed, createElementBlock, h, onBeforeUpdate, onMounted, onUpdated, resolveComponent } from 'vue'
import { useRenderPageData } from '@/views/lowCode/service'

const { renderPage } = useRenderPageData('12312')

function doRender (node: any) {
  const resolve = resolveComponent(node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e))
    })
  }
}

onMounted(() => {
  console.log('初始化生成')
  let elementById = document.getElementById(renderPage.value.components[0].id)
  console.log(elementById)
})

onBeforeUpdate(() => {
  console.log('更新')
})

const componentRender = computed(() => {
  // 2.渲染对话框
  return h('div', { id: 'asdad' }, [...renderPage.value.components, ...renderPage.value.models,].map(m => doRender(m)).filter(m => m))
})

function render () {
}

</script>

<template>
  <componentRender/>
  <render></render>
</template>
<style scoped>

</style>
