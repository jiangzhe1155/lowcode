<script setup lang="ts">

import { computed, createElementBlock, h, onBeforeUpdate, onMounted, onUpdated, resolveComponent } from 'vue'
import { useRenderPageData } from '@/views/lowCode/service'

const { renderPage,componentMap,currentHoverComponent } = useRenderPageData('12312')

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

onMounted(()=>{
  document.addEventListener('mousemove',(e:Event)=>{
    for (let entry of componentMap.value) {
      let [id,component] = entry;
      let element = document.getElementById(id)
      currentHoverComponent(<Node>e.target)
    }
  })

})

const componentRender = computed(() => {
  // 2.渲染对话框

  return h('div', { class:'!min-h-100vh flex !flex-col' }, [...renderPage.value.components, ...renderPage.value.models,].map(m => doRender(m)).filter(m => m))
})

</script>

<template>
  <componentRender/>
</template>
<style scoped>

</style>
