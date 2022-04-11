<script setup lang="ts">

import { defineProps } from 'vue'
import { vElementHover } from '@vueuse/components'
import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { iframeWin, isInside } from '@/views/lowCode/state'

const props = defineProps({
  elementId: {
    type: String,
    require: true
  }
})

function onHover (state: boolean) {
  if (state) {
    sendIframeMessage(iframeWin.value, 'onHoverComponent', { id: props.elementId })
  }
  isInside.value = state
}

function onClick () {
  sendIframeMessage(iframeWin.value, 'onClickComponent', { id: props.elementId })
}

</script>

<template>
  <div v-element-hover="onHover" @click="onClick">
    <slot></slot>
  </div>
</template>

