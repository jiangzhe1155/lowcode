<script setup lang="ts">

import {
  computed, ref
} from 'vue'
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
  return componentValue
})

const title = computed(() => {
  let title = props.element.props.title
  if (!title) {
    return
  }
  let componentValue = title.options[title.idx]
  return componentValue
})

const subTitle = computed(() => {

})

</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span><span v-if="subTitle">-{{ subTitle }}</span></div>
    </template>
    <slot></slot>
  </el-card>
</template>

