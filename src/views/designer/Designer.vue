<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import PropsPanel from '@/views/lowCode/aside/PropsPanel.vue'

import { designerConfig } from '@/stores/constant'
import { onMounted, ref, toRaw, watch, watchEffect } from 'vue'
import { ElButton } from 'element-plus'
import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import BorderHover from '@/views/designer/tool/BorderHover.vue'
import {
  iframeDoc,
  iframeRef,
  iframeWin,
  renderPage,
  back, updateLocationState, locationState, deleteComponent
} from '@/views/designer/common'
import BorderClicked from '@/views/designer/tool/BorderClicked.vue'
import DragItem from '@/views/designer/tool/DragItem.vue'
import BorderPress from '@/views/designer/tool/BorderPress.vue'
import Insertion from '@/views/designer/tool/Insertion.vue'
import TypeDragItem from '@/views/designer/tool/TypeDragItem.vue'
import {
  onIframeMouseClick,
  onIframeMouseDown,
  onIframeMouseIn, onIframeMouseLeave,
  onIframeMouseMove, onIframeMouseOver,
  onIframeMouseUp, onIframeResize, onIframeScroll
} from '@/views/designer/iframeEvent'
import { useClipboard, useMagicKeys } from '@vueuse/core'

const el = ref<HTMLElement>()
onMounted(() => {
  iframeRef.value = el.value
  // document.ondragstart = () => false
})

const onLoad = () => {
  let doc = iframeDoc()
  let win = iframeWin()
  if (win) {
    sendIframeMessage(iframeWin(), 'render', {
      renderPage: toRaw(renderPage.value)
    })
  }
  doc.addEventListener('mousedown', onIframeMouseDown, true)
  doc.addEventListener('mouseup', onIframeMouseUp, false)
  doc.addEventListener('mouseover', onIframeMouseOver, true)
  doc.addEventListener('mouseleave', onIframeMouseLeave, false)
  doc.addEventListener('mouseenter', onIframeMouseIn, false)
  doc.addEventListener('iframeMouseMove', onIframeMouseMove, true)
  doc.addEventListener('click', onIframeMouseClick, true)
  doc.addEventListener('scroll', onIframeScroll, true)
  doc.onselectstart = () => false
  win.addEventListener('resize', onIframeResize, true)
}

watch([renderPage, () => iframeWin()], (n, o) => {
  console.log('renderPage变化了', renderPage)
  if (renderPage && iframeWin()) {
    onLoad()
  }
  setTimeout(() => {
    updateLocationState()
  })
}, { deep: true })

const {
  text,
  copy
} = useClipboard(), exportJson = () => {
  let json = renderPage.value
  console.log('json', json, JSON.stringify(json))
  copy(JSON.stringify(json))
}

// 撤销事件
const {
  Ctrl_Z,
  Backspace
} = useMagicKeys()

watch(Ctrl_Z, (v) => {
  if (v) {
    back()
  }
})

watch(Backspace, (v) => {
  if (v) {
    if (locationState.currentClickComponent && locationState.currentHoverComponent && locationState.currentClickComponent.id === locationState.currentHoverComponent.id) {
      deleteComponent(locationState.currentClickComponent.id)
    }
  }
})

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="designerConfig.headerHeight+'px'">
      <el-button @click="back">撤销</el-button>
      <el-button @click="exportJson">导出json</el-button>
    </el-header>
    <el-container>
      <DragItem></DragItem>
      <TypeDragItem></TypeDragItem>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              id="iframe-holder"
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <BorderHover></BorderHover>
              <BorderClicked></BorderClicked>
              <BorderPress></BorderPress>
              <Insertion></Insertion>
            </div>
            <iframe
                ref="el"
                id="workbench-iframe"
                class="-z-1 h-full w-full" name="Overview"
                @load="onLoad"
                src="http://localhost:3000/#/lowCode/overview"
            >
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1" width="400px">
        <PropsPanel></PropsPanel>
      </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
