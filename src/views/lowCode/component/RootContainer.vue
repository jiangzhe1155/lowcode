<script setup lang="ts">
import { defineProps, onMounted, reactive, ref, watch } from 'vue'
import { useElementBounding } from '@vueuse/core'
import { locationMap, nodeStateOnHover } from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

const el = ref(null)
const location = reactive(useElementBounding(el))

watch(location, (n) => {
  locationMap.set(props.element.id, n)
})

function onHover (state: boolean) {
  nodeStateOnHover(props.element.id, state)
}
</script>

<template>
  <div ref="el" v-element-hover="onHover" class="!min-h-100vh flex !flex-col">
    <slot></slot>
  </div>
</template>
