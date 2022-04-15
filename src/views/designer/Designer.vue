<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import { onMounted, ref, toRaw, watch } from 'vue'
import { ElButton } from 'element-plus'

import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import BorderHover from '@/views/designer/tool/BorderHover.vue'
import {
  currentComponent,
  fetchLocation,
  iframeDoc,
  iframeRef,
  iframeWin,
  isDragging,
  locationState,
  renderPage,
  startDrag,
  x,
  y
} from '@/views/designer/common'
import BorderClicked from '@/views/designer/tool/BorderClicked.vue'
import DragItem from '@/views/designer/tool/DragItem.vue'
import BorderPress from '@/views/designer/tool/BorderPress.vue'

const store = useConfigStore()
const el = ref<HTMLElement>()

const onIframeMouseOver = (e: MouseEvent) => {
  if (e && e.target) {
    locationState.currentHoverComponent = currentComponent(<Node>e.target)
  }
}

const onIframeMouseDrag = (e: MouseEvent) => {
  console.log('鼠标拖动', e.clientX, e.clientY)
  if (startDrag.value) {
    isDragging.value = true
    x.value = e.clientX + 80
    y.value = e.clientY + 70
  }
  // iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
}

const onIframeMouseDown = (e: MouseEvent) => {
  console.log('iframe 按下')
  startDrag.value = true
  locationState.currentPressComponent = currentComponent(<Node>e.target)

  e.stopPropagation()
  e.preventDefault()
  iframeDoc().addEventListener('mousemove', onIframeMouseDrag, true)
  document.addEventListener('mouseup', onDocMouseUp, true)
  document.addEventListener('mousemove', onDocMouseDragging, true)
}

const onIframeMouseUp = (e: Event) => {
  console.log('鼠标抬起', e)
  // 应该当做是一个点击事件
  let componentLocation = currentComponent(<Node>e.target)
  if (componentLocation) {
    locationState.currentClickComponent = componentLocation
  }
  x.value = undefined
  y.value = undefined
  startDrag.value = false
  isDragging.value = false
}

const onIframeMouseLeave = (e: Event) => {
  console.log('鼠标移出', e)
  locationState.currentHoverComponent = undefined
}

const onIframeMouseIn = (e: Event) => {
  console.log('鼠标移入', e)
}

const onIframeScroll = (e: Event) => {
  console.log('屏幕滚动', e)
  if (locationState.currentClickComponent) {
    locationState.currentClickComponent = fetchLocation(locationState.currentClickComponent.id)
  }
  if (locationState.currentHoverComponent) {
    locationState.currentHoverComponent = fetchLocation(locationState.currentHoverComponent.id)
  }
}

const onIframeResize = () => {
  console.log('屏幕缩放')
  if (locationState.currentClickComponent) {
    locationState.currentClickComponent = fetchLocation(locationState.currentClickComponent.id)
  }
  if (locationState.currentHoverComponent) {
    locationState.currentHoverComponent = fetchLocation(locationState.currentHoverComponent.id)
  }
}

const onDocMouseDown = (e: Event) => {
  console.log('主窗口按下', e)
}

const onDocMouseUp = (e: Event) => {
  console.log('主窗口弹起')
  startDrag.value = false
  isDragging.value = false
  document.removeEventListener('mousemove', onDocMouseDragging, true)
  iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
}

const onDocMouseDragging = (e: MouseEvent) => {
  // console.log('主窗口，mousemove', e)
  x.value = e.clientX
  y.value = e.clientY
}

onMounted(() => {
  iframeRef.value = el.value
})

const onLoad = () => {
  let doc = iframeDoc()
  let win = iframeWin()
  if (win) {
    sendIframeMessage(iframeWin(), 'render', {
      renderPage: toRaw(renderPage)
    })
  }
  doc.addEventListener('mousedown', onIframeMouseDown, true)
  doc.addEventListener('mouseup', onIframeMouseUp, false)
  doc.addEventListener('mouseover', onIframeMouseOver, true)
  doc.addEventListener('mouseleave', onIframeMouseLeave, false)
  doc.addEventListener('mouseenter', onIframeMouseIn, false)
  doc.addEventListener('scroll', onIframeScroll, false)
  win.addEventListener('resize', onIframeResize, true)
  doc.onselectstart = () => false
}

watch([renderPage, () => iframeWin()], () => {
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
      <DragItem></DragItem>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <BorderHover></BorderHover>
              <BorderClicked></BorderClicked>
              <BorderPress></BorderPress>


            </div>
            <iframe
                ref="el"
                id="workbench-iframe"
                class="-z-1 h-full w-full" name="Overview2"
                @load="onLoad"
                src="http://localhost:3000/#/lowCode/overview2"
            >
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">{{ locationState }} {{ x }} {{ y }} {{ startDrag }} {{ isDragging }}</el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
