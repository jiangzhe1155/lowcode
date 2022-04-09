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

const {onHover:onHover_}  = useComponentHelp(props, location)

function onHover (state: boolean) {
  onHover_(state)
}

</script>

<template>
  <el-container ref="el" v-element-hover="onHover" class="space-y-6 min-h-100vh !bg-transparent !flex-col p-20px">
    <slot></slot>
  </el-container>
</template>
