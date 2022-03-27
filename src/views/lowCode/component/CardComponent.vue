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

</script>

<template>
  <VisualNodeHelper :location="location">
  </VisualNodeHelper>
  <el-card ref="el">
    <template #header>
      <p>一个卡片</p>
    </template>
  </el-card>
</template>

