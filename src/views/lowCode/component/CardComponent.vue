<script setup lang="ts">
import { defineProps, ref, reactive } from 'vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { useElementBounding } from '@vueuse/core'
const props = defineProps({
  element:{
    type:Object,
    require:true,
    default:null
  }
})

const el = ref(null);
const location = reactive(useElementBounding(el));

const onClick = () => {
  console.log('asdasdsadsad')
}
</script>

<template>
  <VisualNodeHelper :location="location" :element-id="element.id" name="卡片">
  </VisualNodeHelper>
  <el-card ref="el">
    <template #header>
      <p>一个卡片</p>
    </template>
    <el-button @click="onClick">asdasd</el-button>
  </el-card>
</template>

