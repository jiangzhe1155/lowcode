<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useElementHover } from '@vueuse/core'
import { canHover, isClick, nodeStateOnClick } from '@/views/lowCode/workbenchStatusMange'

let props = defineProps({
  location: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    default: '虚拟边框'
  },
  elementId: {
    type: String,
    default: '0'
  }
})

const el = ref()
const isHovered = useElementHover(el)

const isShowHover = computed(() => {
  // 并且鼠标不在特定的区块
  return isHovered.value && canHover(props.elementId)
})

</script>

<template>
  <div
      ref="el"
      class="absolute"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}"
      :class="{'pointer-events-none':!canHover(elementId)}"
      @click="nodeStateOnClick(elementId,props.location)">
    <div v-if="isShowHover" class="w-full h-full"
         :class="['border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25',{'pointer-events-none':!canHover(elementId)}]">
      <p v-if="isShowHover" class="absolute -top-20px text-blue-300 text-sm">{{ name }}</p>
    </div>
  </div>

  <div
      v-if="isClick(elementId)"
      class="z-1 pointer-events-none bg-transparent border-solid border-2 border-blue-500 absolute"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}"
  >
  </div>
</template>

<style>
</style>
