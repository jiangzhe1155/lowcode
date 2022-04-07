<script setup lang="ts">
import {
  defineProps,
  ref,
  reactive,

} from 'vue'
import { onLongPress, useElementBounding, useMousePressed } from '@vueuse/core'
import { Component } from '@/views/lowCode/service'

import { useComponentLocation } from '@/views/lowCode/componentLocation'

const props = defineProps<{
  element: Component
}>()

</script>

<template>
  <el-card>
    <template #header>
      <p>一个卡片</p>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

