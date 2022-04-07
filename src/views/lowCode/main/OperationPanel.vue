<script setup lang="ts">

import { computed, h, onBeforeUpdate, onMounted, onUpdated, resolveComponent } from 'vue'
import { useRenderPageData } from '@/views/lowCode/service'

const { renderPage } = useRenderPageData('12312')

function doRender (node: any) {
  const resolve = resolveComponent(node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
    }, () => {
      return node.children.map((e: any) => doRender(e))
    })
  }
}

onMounted(() => {
  console.log('初始化生成')
})

onBeforeUpdate(() => {
  console.log('更新')
})
const componentRender = computed(() => {
  // 2.渲染对话框
  return h('div', {}, [...renderPage.value.components, ...renderPage.value.models,].map(m => doRender(m)).filter(m => m))
})

</script>

<template>
  <componentRender/>
</template>
<style scoped>

</style>
