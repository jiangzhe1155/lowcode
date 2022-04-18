<script setup lang="ts">

import { onMounted, ref } from 'vue'

const props = defineProps<{
  component: {}
}>()

const component = ref(props.component)

// 设置默认值
onMounted(() => {

})
</script>

<template>
  <div>{{ component.name }} {{ component.props }}</div>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="6">
      <div class="text-sm text-left">开启头部</div>
    </el-col>
    <el-col :span="18">
      <el-switch class="float-left" v-model="component.props.openHeader.value"/>
    </el-col>
    <el-col :span="6">
      <div class="text-sm text-left">头部标题</div>
    </el-col>
    <el-col :span="18">
      <el-input v-model="component.props.headerTitle.value"></el-input>
    </el-col>
  </el-row>
</template>

<style scoped>
</style>
