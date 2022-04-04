<script setup lang="ts">
import {
  defineProps,
  ref,
  reactive,
  onMounted,
  watch,
  onUpdated,
  onBeforeUpdate,
  nextTick,
  getCurrentInstance,
  onDeactivated, toRefs, onActivated
} from 'vue'
import { useElementBounding } from '@vueuse/core'
import { emitter, locationMap, nodeStateOnHover } from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'
import useComponentHelp  from '@/views/lowCode/componentHelp'

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
  <el-card v-element-hover="onHover" ref="el">
    <template #header>
      <p>一个卡片</p>
    </template>
    <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
  </el-card>
</template>

