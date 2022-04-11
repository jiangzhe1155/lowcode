<script setup lang="ts">

import { defineProps } from 'vue'
import { vElementHover } from '@vueuse/components'
import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { iframeWin, locationState } from '@/views/lowCode/state'

const props = defineProps({
  elementId: {
    type: String,
    require: true
  }
})

function onHover (state: boolean) {
  sendIframeMessage(iframeWin.value, 'onHoverComponent', { id: props.elementId })
}

function onClick (state: boolean) {
  sendIframeMessage(iframeWin.value, 'onClickComponent', { id: props.elementId })
}

</script>

<template>
  <div v-element-hover="onHover" @click="onClick">
    <slot></slot>
  </div>
</template>

