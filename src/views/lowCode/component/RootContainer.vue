<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue'
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

onMounted(() => {
  // 上报自己的位置
  locationMap.set(props.element.id, location)
})

function onHover (state: boolean) {
  nodeStateOnHover(props.element.id, state)
}
</script>

<template>
  <div ref="el" v-element-hover="onHover" class="h-full">
    <slot></slot>
  </div>
</template>
