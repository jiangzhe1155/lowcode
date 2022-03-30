<script setup lang="ts">
import { defineProps, ref, reactive, onMounted } from 'vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
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

const onClick = () => {
  console.log('asdasdsadsad')
}

function onHover (state: boolean) {
  nodeStateOnHover(props.element.id, state)
}

</script>

<template>
  <el-card v-element-hover="onHover" ref="el">
    <template #header>
      <p>一个卡片</p>
    </template>
    <el-button @click="onClick">asdasd</el-button>
  </el-card>
</template>

