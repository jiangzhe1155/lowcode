<script setup lang="ts">

import router from '@/router'
import { renderPageStore,designerConfig } from '@/stores/constant'
import { renderPage,back } from '@/views/designer/common'
import { useClipboard } from '@vueuse/core'

const {
  text,
  copy
} = useClipboard()

const exportJson = () => {
  let json = renderPage.value
  console.log('json', json, JSON.stringify(json))
  copy(JSON.stringify(json))
}

const onSave = () => {
  renderPageStore.value = renderPage.value
}

const onPreview = () => {
  onSave()
  let routeData = router.resolve({
    name: "Preview",
  });
  window.open(routeData.href, '_blank');
}

import {
  isDragging, isPanelOpen,
} from '@/views/designer/common'


</script>
<template>


  {{isDragging}}

  <el-button @click="back">撤销</el-button>
    <el-button @click="exportJson">导出json</el-button>
    <el-button @click="onSave">保存到本地</el-button>
    <el-button @click="onPreview">预览</el-button>
</template>

<style scoped>

</style>
