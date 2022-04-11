<script setup lang="ts">

import { computed, h, resolveComponent } from 'vue'
import { Root, useRenderPageData } from '@/views/lowCode/service'

const {
  renderPage
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
  console.log(renderPage)
  // 2.渲染对话框
  return h('div', { class: '!min-h-100vh flex !flex-col' }, doRender(renderPage))
})

</script>

<template>
  <componentRender></componentRender>
</template>
<style scoped>

</style>
