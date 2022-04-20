<script setup lang="ts">

import { onMounted, Ref, ref, watch } from 'vue'
import {
  Card, CardProp
} from '@/views/designer/interface/component'

const props = defineProps<{
  component: Ref<Card>
}>()

const config = ref(new CardProp())

onMounted(() => {
  console.log('config', config.value, props.component.value)
  let componentConfig = config.value
})

watch(config, () => {
  // 深拷贝
  props.component.value.props = JSON.parse(JSON.stringify(config.value))
}, { deep: true })

watch(props.component,()=>{
  if (!props.component || !props.component.value){
    return
  }
  let prop : CardProp = props.component.value.props;
  for (const [key , val] of Object.entries(config.value)) {
    if (Reflect.has(prop,key)){
      let p = prop[key];
      val.idx = p.idx
      for (const [pK , pV]  of Object.entries(p.options)) {
        if (Reflect.has(val.options,pK)){
          val.options[pK] = pV
        }
      }
    }
  }
},{immediate:true,deep:true})

</script>

<template>
  <el-row align="middle" :gutter="4" class="!mx-12px">
    <el-col :span="6">
      <div class="text-sm text-left">开启头部</div>
    </el-col>
    <el-col :span="18">
      <el-switch v-if="config.enableHeader.idx === 'boolean'" class="float-left"
                 v-model="config.enableHeader.options[config.enableHeader.idx]"/>
    </el-col>
  </el-row>

  <el-row align="middle" :gutter="4" class="!mx-12px" v-if="config.enableHeader.options[config.enableHeader.idx]">
    <el-col :span="6">
      <div class="text-sm text-left">标题</div>
    </el-col>
    <el-col :span="18">
      <el-input v-if="config.title.idx === 'string'" v-model="config.title.options[config.title.idx]"></el-input>
    </el-col>
  </el-row>

</template>

<style scoped>
</style>
