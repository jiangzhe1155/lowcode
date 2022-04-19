<script setup lang="ts">

import { onMounted, ref } from 'vue'
import { Card } from '@/views/designer/interface/component'

const props = defineProps<{
  component: Card
}>()

const component = ref(props.component)

</script>

<template>
  <div>{{ component.name }}</div>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="6">
      <div class="text-sm text-left">开启头部</div>
    </el-col>
    <el-col :span="18">
      <el-switch class="float-left" v-model="component.props.aa"/>
    </el-col>
    <el-col :span="6">
      <div class="text-sm text-left">头部标题</div>
    </el-col>
    <el-col :span="18">
<!--      <el-input v-model="component.props.headerTitle.value"></el-input>-->
    </el-col>
    <el-col :span="6">
      <div class="text-sm text-left">副标题</div>
    </el-col>
    <el-col :span="18">
<!--      <el-input v-model="component.props.subTitle.value"></el-input>-->
    </el-col>
  </el-row>
</template>

<style scoped>
</style>
