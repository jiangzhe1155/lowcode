<script setup lang="ts">

import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import { nodeState, nodeStateOnClick, renderPage } from '@/views/lowCode/workbenchStatusMange'
import { computed, h, resolveComponent, watch } from 'vue'

watch(renderPage, (n) => {
})
const onCLick = () => {
  nodeStateOnClick(nodeState.currentHoveredId)
}

const render = computed(() => {
  console.log('节点更新拉')

  function doRender (node: any) {
    const resolve = resolveComponent(node.type)
    return h(resolve, { element: node }, () => {
      return node.children.map((e: any) => doRender(e))
    })
  }

  return doRender(renderPage.root)
})

</script>

<template>
  <render/>
</template>
<style scoped>

</style>
