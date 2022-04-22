<script setup lang="ts">

import { computed } from 'vue'
import { Card } from '@/views/designer/interface/component'
import { getProp } from '@/views/designer/propsWatcher'

const props = defineProps<{
  component: Card,
  state: any
}>()

const showHeader = computed(() => {
  return getProp(props.component.props.enableHeader)
})

const title = computed(() => {
  let res = getProp(props.component.props.title)
  let idx = props.component.props.title.idx
  if (idx === 'string') {
    return res
  } else if (idx === 'variable') {
    try {
      return eval(`props.state.value.${res}`)
    } catch (e) {
    }
  }
})

</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span></div>
    </template>
    <slot></slot>
  </el-card>
</template>

