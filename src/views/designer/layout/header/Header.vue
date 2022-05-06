<script setup lang="ts">

import router from "@/router";
import { renderPageStore } from "@/stores/constant";
import { renderPage, back, isDragging,asideComponentType,asideComponentGroup,locationState,y } from "@/views/designer/service/common";
import { useClipboard } from "@vueuse/core";
import axios from "axios";

const {
  text,
  copy
} = useClipboard();

const exportJson = () => {
  let json = renderPage.value;
  console.log("json", json, JSON.stringify(json));
  copy(JSON.stringify(json));
};

const onSave = () => {
  renderPageStore.value = renderPage.value;
};

const onPreview = () => {
  onSave();
  let routeData = router.resolve({
    name: "Preview"
  });
  window.open(routeData.href, "_blank");
};

const onMock = () => {
  axios.get(`/api/getUsers`).then(res => {
    console.log('users', res)
  }).catch(err => {
    console.log(err)
  })
};


</script>
<template>
  {{asideComponentGroup }} {{asideComponentType}} {{locationState.currentInsertionComponent}}{{y}} {{isDragging}}
  <el-button @click="back">撤销</el-button>
  <el-button @click="onMock">测试mock</el-button>
  <el-button @click="exportJson">导出json</el-button>
  <el-button @click="onSave">保存到本地</el-button>
  <el-button @click="onPreview">预览</el-button>
</template>

<style scoped>

</style>
