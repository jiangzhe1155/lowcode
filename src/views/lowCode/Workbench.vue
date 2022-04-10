<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'

import VisualNodeHelper2 from '@/views/lowCode/VisualNodeHelper2.vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'

import { onMounted, ref } from 'vue'

const el = ref<HTMLElement | null>(null)
const store = useConfigStore()
import { addMessageListener } from '@/views/lowCode/iframeUtil'
import { controlState, isInside, locationState, renderPage, point, x, y ,isShowInsertion} from '@/views/lowCode/state'
import { vElementHover } from '@vueuse/components'

onMounted(() => {
  addMessageListener('locationStateChange', (payload: any) => {
    locationState.value = payload.locationState
  })
  addMessageListener('renderPageUpdate', (payload: any) => {
    renderPage.value = payload.renderPage
  })
  addMessageListener('controlStateUpdate', (payload: any) => {
    controlState.value = payload.controlState
    // console.log('接收变化', controlState.value.x, controlState.value.y)
  })
  document.addEventListener('mousemove', (event) => {
    // console.log('鼠标移动', event.x, event.y)
  })

  document.addEventListener('mousedown', (event) => {
    console.log('按钮按下', event)

  })
})

function onHover (state: boolean) {
  isInside.value = state
}

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      {{ isInside }} {{ point }} {{ x }} {{ y }} {{ controlState }} {{isShowInsertion}}
      <el-button></el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div
                class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <VisualNodeHelper2>
              </VisualNodeHelper2>
            </div>
            <iframe
                id="workbench-iframe"
                ref="iframeRef" class="h-full w-full" name="Overview"
                src="http://localhost:3000/#/lowCode/overview"
            >>
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">{{ locationState }}</el-aside>
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
