<script setup lang="ts">

import { onMounted, Ref, ref, watch } from 'vue'
import {
  Card, CardProp, Table, TableProp
} from '@/views/designer/interface/component'
import { usePropsWatcher } from '@/views/designer/propsWatcher'

const props = defineProps<{
  component: Ref<Table>
}>()

const config = ref(new TableProp())
usePropsWatcher(config, props.component)


</script>

<template>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    数据行
  </el-row>

</template>

<style scoped>
</style>
