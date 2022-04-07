<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'

import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { ref} from 'vue'

const el = ref<HTMLElement | null>(null)
const store = useConfigStore()
import { useRenderPageData } from '@/views/lowCode/service'


let { renderPage } = useRenderPageData('12312')

// const iframeRef = ref(null)
//
// const iframeWin = ref(null)
// const onLoad = () => {
//   iframeWin.value = iframeRef.value.contentWindow
//   console.log('加载', iframeWin)
//   iframeWin.value.focus({ preventScroll: false })
// }

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      <el-button></el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              ref="el"
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-visible overflow-x-hidden"
          >
            <div
                class="absolute left-0 top-0 z-800 w-full h-full select-none pointer-events-none">
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
      <el-aside class="border-l-1"></el-aside>
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
