<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import {
  onMounted, ref, toRaw,
  watchEffect
} from 'vue'
import { ElButton } from 'element-plus'

import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { currentComponent, renderPage, iframeWin, iframeRef, componentMap } from '@/views/designer/common'

const store = useConfigStore()
const el = ref<HTMLElement>()

const onLoad = () => {
  if (iframeWin.value) {
    sendIframeMessage(iframeWin.value, 'render', {
      renderPage: toRaw(renderPage)
    })
  }
}

watchEffect(() => {
  if (renderPage && iframeWin.value) {
    onLoad()
  }
})

const onIframeMouseMove = (e: MouseEvent) => {
  console.log('鼠标移动', e.clientX, e.clientY)
  if (e && e.target) {
    let c = currentComponent(<Node>e.target)
    console.log('找到目标', componentMap.value.get(c?.id).name)
  }
}

const onIframeMouseDown = (e: Event) => {
  console.log('鼠标按下', e)
  iframeWin.value.addEventListener('mouseup', onIframeMouseUp)
}

const onIframeMouseUp = (e: Event) => {
  console.log('鼠标抬起', e)
}

onMounted(() => {
  iframeRef.value = el.value
  iframeWin.value.addEventListener('mousedown', onIframeMouseDown)
  iframeWin.value.addEventListener('mousemove', onIframeMouseMove)
})

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
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <!--                    <VisualNodeHelper>-->
              <!--                    </VisualNodeHelper>-->
            </div>
            <iframe
                ref="el"
                id="workbench-iframe"
                class="h-full w-full" name="Overview2"
                @load="onLoad"
                src="http://localhost:3000/#/lowCode/overview2"
            >
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">1232213</el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
