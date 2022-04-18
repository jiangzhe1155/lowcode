<script setup lang="ts">

import {
  computed,
  defineProps
} from 'vue'
import { Component } from '@/views/lowCode/service'

const props = defineProps<{
  element: Component,
  state:{}
}>()

const showHeader = computed(() => {
  let openHeader = props.element.props.openHeader
  if (!openHeader || !openHeader.type) {
    return false
  }

  if (openHeader.type === 'boolean') {
    return openHeader.value
  }
})

const title = computed(() => {
  let openHeader = props.element.props.headerTitle
  if (!openHeader || !openHeader.type) {
    return ''
  }

  if (openHeader.type === 'string') {
    return openHeader.value
  }
})
</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span>-<span>{{state.value.title}}</span></div>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

