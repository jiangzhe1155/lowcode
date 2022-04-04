<script setup lang="ts">
import { defineProps, onMounted, onUpdated, reactive, ref, watch } from 'vue'
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
  <el-container v-element-hover="onHover" ref="el" class="space-y-6 h-full !bg-transparent !flex-col p-20px">
    <slot></slot>
  </el-container>
</template>
