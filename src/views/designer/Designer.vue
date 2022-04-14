<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import { onMounted, ref, toRaw, watchEffect } from 'vue'
import { ElButton } from 'element-plus'

import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'
import BorderHover from '@/views/designer/tool/BorderHover.vue'
import {
  currentComponent,
  renderPage,
  iframeWin,
  iframeRef,
  locationState, iframeDoc
} from '@/views/designer/common'
import { useMouseInElement } from '@vueuse/core'
import { isInside } from '@/views/lowCode/state'

const store = useConfigStore()
const el = ref<HTMLElement>()

const onIframeMouseMove = (e: MouseEvent) => {
  // console.log('鼠标移动', e.clientX, e.clientY)
  if (e && e.target) {
    locationState.currentHoverComponent = currentComponent(<Node>e.target)
  }
}

const onIframeMouseDown = (e: Event) => {
  console.log('鼠标按下', e)
  iframeWin().addEventListener('mouseup', onIframeMouseUp)
}

const onIframeMouseUp = (e: Event) => {
  console.log('鼠标抬起', e)
  iframeWin().removeEventListener('mouseup', onIframeMouseUp)
}

const onIframeMouseLeave = (e: Event) => {
  console.log('鼠标移出', e)
  locationState.currentHoverComponent = undefined
}

const onIframeMouseIn = (e: Event) => {
  console.log('鼠标移入', e)
}

onMounted(() => {
  iframeRef.value = el.value
})

const onLoad = () => {
  if (iframeWin()) {
    sendIframeMessage(iframeWin(), 'render', {
      renderPage: toRaw(renderPage)
    })
  }
  iframeDoc().addEventListener('mousedown', onIframeMouseDown)
  iframeDoc().addEventListener('mouseover', onIframeMouseMove, false)
  iframeDoc().addEventListener('mouseleave', onIframeMouseLeave, false)
  iframeDoc().addEventListener('mouseenter', onIframeMouseIn, false)

}

watchEffect(() => {
  if (renderPage && iframeWin()) {
    onLoad()
  }
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
              <BorderHover></BorderHover>
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
      <el-aside class="border-l-1">{{ locationState }}</el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
