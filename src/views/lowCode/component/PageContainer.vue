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
  <el-container v-element-hover="onHover" ref="el" class="space-y-6 h-full !bg-transparent !flex-col p-20px">
    <slot></slot>
  </el-container>
</template>
