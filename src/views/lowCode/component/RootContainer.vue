<script setup lang="ts">
import { defineProps, ref, reactive } from 'vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { useElementBounding } from '@vueuse/core'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})
const el = ref(null)
const location = reactive(useElementBounding(el))
</script>

<template>
  <div ref="el" class="h-full">
    <VisualNodeHelper :location="location" element-id='1' name="Root">
    </VisualNodeHelper>
    <slot></slot>
  </div>
</template>
