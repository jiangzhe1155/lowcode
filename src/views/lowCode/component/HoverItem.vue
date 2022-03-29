<script setup lang="ts">

import { defineProps } from 'vue'
import { vElementHover } from '@vueuse/components'
import { nodeStateOnHover, nodeStateOnHoverItem } from '@/views/lowCode/workbenchStatusMange'

const props = defineProps({
  elementId: {
    type: String,
    require: true
  }
})

function onHover (state: boolean) {
  nodeStateOnHoverItem(props.elementId, state)
}

</script>

<template>
  <div v-element-hover="onHover">
    <slot></slot>
  </div>
</template>

