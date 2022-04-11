<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'

import VisualNodeHelper from '@/views/lowCode/VisualNodeHelper.vue'
import { onMounted, ref } from 'vue'

const iframeRef = ref(null)

const store = useConfigStore()
import { addMessageListener } from '@/views/lowCode/iframeUtil'
import {
  controlState,
  isInside,
  locationState,
  renderPage,
  point,
  x,
  y,
  isShowInsertion,
  iframeWin,
  asideHoverType
} from '@/views/lowCode/state'
import { vElementHover } from '@vueuse/components'

onMounted(() => {
  addMessageListener('locationStateChange', (payload: any) => {
    locationState.value = payload.locationState
  })
  addMessageListener('renderPageUpdate', (payload: any) => {
    // console.log('接收变化 renderPageUpdate',payload.renderPage)
    renderPage.value = payload.renderPage
  })
  addMessageListener('controlStateUpdate', (payload: any) => {
    controlState.value = payload.controlState
    // console.log('接收变化', controlState.value.x, controlState.value.y)
  })

  if (iframeRef.value) {
    iframeWin.value = iframeRef.value?.contentWindow
  }

})

function onHover (state: boolean) {
  isInside.value = state
}

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      {{ isInside }} {{ point }} {{ x }} {{ y }} {{ controlState }} {{ isShowInsertion }} {{ asideHoverType }}
      <el-button></el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              v-element-hover="onHover"
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div
                class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <VisualNodeHelper>
              </VisualNodeHelper>
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
