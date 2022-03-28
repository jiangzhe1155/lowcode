<script setup lang="ts">
import { defineProps, reactive, ref } from 'vue'
import { useElementBounding } from '@vueuse/core'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'

const props = defineProps({
  element:{
    type:Object,
    require:true,
    default:null
  }
})

const el = ref(null);
const location = reactive(useElementBounding(el));

</script>

<template>
  <el-container ref="el" class="h-full !bg-transparent !flex-col p-20px">
    <VisualNodeHelper :location="location" element-id="2">
    </VisualNodeHelper>
    <slot></slot>
  </el-container>
</template>
