<script setup lang="ts">

import {
  computed
} from 'vue'
import { ValueType } from '@/views/lowCode/service'
import { Card } from '@/views/designer/interface/component'

const props = defineProps<{
  element: Card,
  state: any
}>()

const showHeader = computed(() => {
  let enableHeader = props.element.props.enableHeader
  if (!enableHeader) {
    return
  }
  let componentValue = enableHeader.options[enableHeader.idx]
  if (!componentValue) {
    return
  }
  return componentValue.value
})

const title = computed(() => {

})

const subTitle = computed(() => {

})
</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span><span v-if="subTitle">-{{ subTitle }}</span></div>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

