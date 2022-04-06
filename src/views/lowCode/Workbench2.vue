<script setup lang="ts">
import LowCodeAside from './aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import OperationPanel2 from '@/views/lowCode/main/OperationPanel2.vue'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'

import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { onLongPress, useMouseInElement, useMousePressed, useScroll, UseScrollReturn } from '@vueuse/core'
import {
  nodeState,
  onDragEnd,
  onStartSelect,
  x,
  y,
  renderPage,
  nodeStateOnClick,
  locationMap, nodeStateOnHover, onDrag, elementMap
} from './workbenchStatusMange'

const el = ref<HTMLElement | null>(null)

const store = useConfigStore()

const { pressed } = useMousePressed({ target: el })

const onCLick = () => {
  nodeStateOnClick(nodeState.currentHoveredId)
}

const iframeRef = ref(null)
const {
  y: scrollY
} = useScroll(iframeRef)

const iframeWin = ref(null)

function handleMessage (event) {
  let {
    type,
    location,
    elementId,
    element
  } = event.data
  if (type === 'onHover') {
    let state = event.data.state
    // console.log('hover',element.id,state)
    nodeStateOnHover(element, state, location)
  } else if (type === 'locationChange') {
    // console.log('更新位置',location,elementId)
    locationMap.set(elementId, location)
  } else if (type === 'onClick') {
    nodeStateOnClick(nodeState.currentHoveredId)
  } else if (type === 'onDrag') {
    pressed.value = true
  } else if (type === 'onDragEnd') {
    console.log('接受到长按事件回掉')
    pressed.value = false
    onDragEnd()
  } else if (type === 'onStartSelect') {
    nodeState.pressNodeId = nodeState.currentHoveredId
    onStartSelect()
    pressed.value = true
  } else if (type === 'onMouseMove') {
    x.value = event.data.x + 80
    y.value = event.data.y + 70
  } else if (type === 'elementAdd') {
    let addId = event.data.elementId
    nodeStateOnClick(addId)
  } else if (type === 'elementMove') {
    let moveId = event.data.elementId
    nodeStateOnClick(moveId)
  } else if (type === 'elementCopy') {
    let moveId = event.data.elementId
    nodeStateOnClick(moveId)
  } else if (type === 'elementDelete') {
    nodeState.clickedNodeId = null
    console.log('删除')
  } else if (type === 'elementMapChange') {
    console.log('elementMap 變化', event.data.elementMap)
    let elementMap2 = event.data.elementMap
    elementMap.clear()
    for (var entry of elementMap2) { // 遍历Map
      elementMap.set(entry[0], entry[1])
    }
  }else if (type === 'renderPageChange'){
    renderPage.root = event.data.renderPage
  } else {
    console.log(event)
  }
}

watch(() => iframeWin.value, (n) => {
  console.log('iframe 变化', iframeWin.value.scrollX)
})

onMounted(() => {
  iframeWin.value = iframeRef.value.contentWindow
  nodeState.iframeWin = iframeRef.value.contentWindow
  window.addEventListener('message', handleMessage)
  window.addEventListener('mousemove', (event) => {
    // console.log('鼠标移动',event)
    x.value = event.clientX
    y.value = event.clientY
  })
})

onUnmounted(() => {

})


const { isOutside } = useMouseInElement(el)

</script>
<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      {{ x }} {{ y }} {{ nodeState.currentHoveredId }} {{ nodeState.clickedNodeId }} 拖拽元素 {{ nodeState.dragElementId }}
      {{ nodeState.pressTypeId }} {{isOutside}}
      <el-button @click="nodeStateOnClick('8')">asda</el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              ref="el"
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
              @click="onCLick"
          >
            <div
                class="absolute left-0 top-0 z-800 w-full h-full select-none pointer-events-none"
                :class="{'pointer-events-none':true}"
            >
              <VisualNodeHelper :scroll-y="scrollY">
              </VisualNodeHelper>
            </div>
            <iframe
                id="workbench-iframe"
                ref="iframeRef" class="h-full w-full" name="Overview"
                src="http://localhost:3000/#/lowCode/overview"
            >
              >
            </iframe>
          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1">{{ elementMap }}</el-aside>
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
