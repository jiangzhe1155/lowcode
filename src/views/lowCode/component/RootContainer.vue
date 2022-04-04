<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { emitter, locationMap, nodeStateOnHover } from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'
import useComponentHelp from '@/views/lowCode/componentHelp'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

const el = ref(null)
const location = reactive(useElementBounding(el))

useComponentHelp(props,location)

function onHover (state: boolean) {
  nodeStateOnHover(props.element.id, state)
}

</script>

<template>
  <div ref="el" v-element-hover="onHover" class="!min-h-100vh flex !flex-col">
    <slot></slot>
  </div>
</template>
