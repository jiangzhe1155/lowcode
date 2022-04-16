<script setup lang="ts">

import { defineProps } from 'vue'
import { vElementHover } from '@vueuse/components'
import { currentComponentFromArea, fetchLocation, locationState, x, y } from '@/views/designer/common'

const props = defineProps({
  elementId: {
    type: String,
    require: true
  }
})

function onHover (state: boolean) {
  console.log(x.value, y.value)
  locationState.currentHoverComponent = fetchLocation(props.elementId!)
}

function onClick () {
  locationState.currentClickComponent = fetchLocation(props.elementId!)
}

</script>

<template>
  <div v-element-hover="onHover" @click="onClick">
    <slot></slot>
  </div>
</template>

