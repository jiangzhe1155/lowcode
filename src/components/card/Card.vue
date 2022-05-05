<script setup lang="ts">

import { computed, onMounted } from "vue";
import { Card } from "@/views/designer/service/component";
import { getProp } from "@/views/designer/service/propsWatcher";

const props = defineProps<{
  component: Card,
  state: any
}>();

const showHeader = computed(() => {
  return getProp(props.component.props.enableHeader);
});

const title = computed(() => {
  let res = getProp(props.component.props.title);
  let idx = props.component.props.title.idx;
  if (idx === "string") {
    return res;
  } else if (idx === "variable") {
    try {
      return eval(`props.state.${res}`);
    } catch (e) {
    }
  }
});

onMounted(() => {
  console.log("card 重新加载了");
});
</script>

<template>
  <el-card>
    <template #header v-if="showHeader">
      <div class="flex"><span class="font-semibold">{{ title }}</span></div>
    </template>
    <slot></slot>
  </el-card>
</template>

