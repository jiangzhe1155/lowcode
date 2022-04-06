<script setup lang="ts">

import { nodeState, nodeStateOnClick, renderPage} from '@/views/lowCode/workbenchStatusMange'
import { computed, h, resolveComponent, watch, getCurrentInstance, onUpdated, ref, reactive } from 'vue'
import DialogComponent from '@/views/lowCode/component/DialogComponent.vue'
import { useRenderPageData } from '@/views/lowCode/service'

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

let {state}  = useRenderPageData('12312')


</script>
<template>
  {{state}}
  <render></render>
</template>
<style scoped>

</style>
