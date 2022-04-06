<script setup lang="ts">

import { nodeState, nodeStateOnClick, renderPage, x, y } from '@/views/lowCode/workbenchStatusMange'
import { computed, h, resolveComponent, watch, getCurrentInstance, onUpdated, ref, reactive } from 'vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'

let { ctx: that } = getCurrentInstance()

const render = computed(() => {
  function doRender (node: any) {
    const resolve = resolveComponent(node.type)
    if (node.visible) {
      return h(resolve, { element: node }, () => {
        return node.children.map((e: any) => doRender(e))
      })
    }
  }

  return doRender(renderPage.root)
})


</script>
<template>
  <render></render>
</template>
<style scoped>

</style>
