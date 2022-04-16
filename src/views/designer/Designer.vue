<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import { nextTick, onMounted, ref, toRaw, watch } from 'vue'
import { ElButton } from 'element-plus'

import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import BorderHover from '@/views/designer/tool/BorderHover.vue'
import {
  currentComponent,
  currentComponentFromArea,
  fetchLocation,
  iframeDoc,
  iframeRef,
  iframeWin,
  isDragging,
  locationState,
  renderPage,
  startDrag,
  x,
  y,
  locationMap,
  fetchDirection,
  isShowInsertion,
  scrollToTopOrBottom,
  move,
  asideComponentType,
  asideComponentGroup,
  isInside,
  isPanelOpen,
  isAffixPanel
} from '@/views/designer/common'
import BorderClicked from '@/views/designer/tool/BorderClicked.vue'
import DragItem from '@/views/designer/tool/DragItem.vue'
import BorderPress from '@/views/designer/tool/BorderPress.vue'
import Insertion from '@/views/designer/tool/Insertion.vue'
import TypeDragItem from '@/views/designer/tool/TypeDragItem.vue'
import { useMouseInElement } from '@vueuse/core'
import { onIframeMouseDown, onIframeMouseDrag, onIframeMouseUp } from '@/views/designer/iframeEvent'

const store = useConfigStore()
const el = ref<HTMLElement>()

const onIframeMouseOver = (e: MouseEvent) => {
  if (e && e.target) {
    locationState.currentHoverComponent = currentComponent(<Node>e.target)
  }
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
  if (locationState.currentPressComponent) {
    locationState.currentPressComponent = fetchLocation(locationState.currentPressComponent.id)
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
  if (locationState.currentPressComponent) {
    locationState.currentPressComponent = fetchLocation(locationState.currentPressComponent.id)
  }
}

onMounted(() => {
  iframeRef.value = el.value
  document.ondragstart = () => false
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
  doc.addEventListener('iframeMouseMove', (e: MouseEvent) => {
    if (isInside()) {
      locationState.currentInsertionComponent = currentComponentFromArea(e.clientX, e.clientY)
      locationState.direction = fetchDirection(e.clientX, e.clientY)
      scrollToTopOrBottom()
    }
  }, true)

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
                class="-z-1 h-full w-full" name="Overview2"
                @load="onLoad"
                src="http://localhost:3000/#/lowCode/overview2"
            >
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">
        {{ isShowInsertion }}
        {{ locationState }}
        {{ x }}
        {{ y }}
        {{ startDrag }}
        {{ isDragging }}
        {{ locationMap }}
        {{ asideComponentType }}
        {{ asideComponentGroup }}
        isInside:{{ isInside() }}
        isAffix:{{ isAffixPanel }}
        isPanelOpen:{{
          isPanelOpen
        }}
      </el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
