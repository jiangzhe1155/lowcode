<script setup lang="ts">

import { computed, createElementBlock, h, onBeforeUpdate, onMounted, onUpdated, resolveComponent } from 'vue'
import { useRenderPageData } from '@/views/lowCode/service'

const {
  renderPage,
  locationMap,
  isScrolling,
  controlState
} = useRenderPageData('12312')

function doRender (node: any) {
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
  // 2.渲染对话框
  return h('div', { class: '!min-h-100vh flex !flex-col' }, [...renderPage.components].map(m => doRender(m)).filter(m => m))
})
//
// const componentModelRender = computed(() => {
//   if (renderPage.models && renderPage.models.length > 0) {
//     // 2.渲染对话框
//     return h('div', {}, [...renderPage.models,].map(m => doRender(m)).filter(m => m))
//   }
// })

</script>

<template>
  <componentRender></componentRender>
<!--  <componentModelRender></componentModelRender>-->
</template>
<style scoped>

</style>
