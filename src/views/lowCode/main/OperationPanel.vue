<script setup lang="ts">

import { nodeState, nodeStateOnClick, renderPage } from '@/views/lowCode/workbenchStatusMange'
import { computed, h, resolveComponent, watch, getCurrentInstance, onUpdated, ref, reactive } from 'vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'

let { ctx: that } = getCurrentInstance()

const renderPage_ = reactive(renderPage);

const render = computed(() => {
  function doRender (node: any) {
    const resolve = resolveComponent(node.type)
    return h(resolve, { element: node }, () => {
      return node.children.map((e: any) => doRender(e))
    })
  }

  return doRender(renderPage_.root)
})

</script>

<template>
  <render></render>
</template>
<style scoped>

</style>
