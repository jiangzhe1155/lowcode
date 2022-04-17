<script setup lang="ts">
import {
  defineProps,
} from 'vue'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})



</script>

<template>
  <el-card>
    <template #header>
      <p>一个卡片</p>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

