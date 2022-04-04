<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import OperationPanel2 from '@/views/lowCode/main/OperationPanel2.vue'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'

import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { ref, watch } from 'vue'
import { onLongPress, useMousePressed, useScroll } from '@vueuse/core'
import { nodeState, onDragEnd, onStartSelect, x, y, renderPage, nodeStateOnClick,locationMap } from './workbenchStatusMange'

const el = ref<HTMLElement | null>(null)
const {
  y: scrollY
} = useScroll(el)

const { pressed } = useMousePressed({ target: el })
const store = useConfigStore()

const longPressed = ref(false)
onLongPress(el, ()=>{
  longPressed.value = true;
  onStartSelect()
}, { delay: 300 })


watch(pressed, (n) => {
  console.log('按压了',n)
  if (n) {
  } else {
    onDragEnd()
    longPressed.value = false;
  }
})

const onCLick = () => {
  nodeStateOnClick(nodeState.currentHoveredId)
}

</script>
<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      {{ x }} {{ y }} {{ pressed }} {{ nodeState.isDrag }} {{longPressed}}
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0">
        <div class="relative h-full shadow border-solid border-1">
          <div
              ref="el"
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-scroll overflow-x-hidden"
              @click="onCLick"
          >
            <VisualNodeHelper :scroll-y="scrollY">
            </VisualNodeHelper>
            <OperationPanel>
            </OperationPanel>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">{{ locationMap }}</el-aside>
    </el-container>
  </el-container>
</template>
<style>
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
}

/* 滚动条的滑块 */
::-webkit-scrollbar-thumb {
  background-color: #a1a3a9;
  border-radius: 3px;
}

</style>
