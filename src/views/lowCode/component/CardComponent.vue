<script setup lang="ts">

import {
  computed
} from 'vue'
import { Component, ValueType } from '@/views/lowCode/service'

const props = defineProps<{
  element: Component,
  state: any
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
  let headerTitle = props.element.props.headerTitle
  if (!headerTitle || !headerTitle.type) {
    return ''
  }

  if (headerTitle.type === 'string') {
    return headerTitle.value
  }
})

const subTitle = computed(() => {
  let subTitle = props.element.props?.subTitle
  if (!subTitle) {
    return
  }
  let type = subTitle.type as ValueType
  if (type === 'string') {
    return subTitle.value
  } else if (type === 'variable') {
    return props.state?.value[subTitle.value]
  }
})

</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span>-<span>{{ subTitle }}</span></div>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

