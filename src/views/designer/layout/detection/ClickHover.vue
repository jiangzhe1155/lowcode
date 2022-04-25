<script setup lang="ts">
import { vElementHover } from '@vueuse/components'
import { fetchLocation, locationState} from '@/views/designer/service/common'

const props = defineProps({
  elementId: {
    type: String,
    require: true
  }
})

function onHover (state: boolean) {
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

