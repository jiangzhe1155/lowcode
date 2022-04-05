<script setup lang="ts">
import {
  computed,
  defineProps,
  getCurrentInstance,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect
} from 'vue'
import { vElementHover } from '@vueuse/components'

import { CopyDocument, Delete, Lock } from '@element-plus/icons-vue'
import HoverItem from '@/views/lowCode/component/HoverItem.vue'
import {
  nodeStateOnClick,
  nodeState,
  locationMap,
  elementMap,
  x,
  y, onDrag
} from '@/views/lowCode/workbenchStatusMange'
import { isClient, toReactive, useDraggable, useMousePressed } from '@vueuse/core'
import { Num } from 'windicss/types/lang/tokens'

const el = ref<HTMLElement | null>(null)

const props = defineProps({
  scrollY: {
    type: Number,
    require: true,
    default: 0
  }
})

const styleCompute = computed(() => {
  let location = nodeState.hoverLocation
  if (!location) {
    return {
      top: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
  return {
    top: location.top + 1 + props.scrollY + 'px',
    width: location.width + 'px',
    height: location.height + 'px',
    left: location.left  - 1 + 'px',
  }
})

const pressStyleCompute = computed(() => {
  let location =  locationMap.get(nodeState.pressNodeId)
  if (!location) {
    return {
      top: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
  return {
    top: location.top - 1 + props.scrollY + 'px',
    width: location.width + 'px',
    height: location.height + 'px',
    left: location.left - 1 + 'px'
  }
})

const dragStyleCompute = computed(() => {
  onDrag()
  return {
    left: x.value - 10  + 'px',
    top: y.value - 10 + 'px',
  }
})

const clickStyleCompute = computed(() => {
  // console.log('获取点击样式')
  let location = nodeState.clickLocation
  if (!location) {
    return {
      top: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
  return {
    top: location.top  + 1 + props.scrollY + 'px',
    width: location.width + 'px',
    height: location.height + 'px',
    left: location.left - 1 + 'px'
  }
})

const directionStyle = computed(() => {
  let location = locationMap.get(nodeState.clickedNodeId)
  if (!location) {
    return {}
  }
  return {
    '-top-26px': location.top > 100
  }
})

const dragInsertionStyleCompute = computed(() => {
  let {
    top,
    width,
    height,
    left
  } = nodeState.dragLocation
  let direction = nodeState.dragDirection

  if (direction == 'right') {
    return {
      width: '4px',
      height: height + 'px',
      left: left + width  - 4 + 'px',
      top: top  + props.scrollY + 'px'
    }
  }

  if (direction == 'left') {
    return {
      width: '4px',
      height: height + 'px',
      left: left  + 'px',
      top: top  + props.scrollY + 'px'
    }
  }

  if (direction == 'top') {
    return {
      height: '4px',
      width: width + 'px',
      left: left  + 'px',
      top: top  + props.scrollY + 'px'
    }
  }

  if (direction == 'bottom') {
    return {
      height: '4px',
      width: width + 'px',
      left: left  + 'px',
      top: top  + height + props.scrollY - 4 + 'px'
    }
  }

  return {
    height: height + 'px',
    width: width + 'px',
    left: left + 'px',
    top: top  + props.scrollY - 4 + 'px'
  }
})

 const onCopy = ()=>{
   nodeState.iframeWin.postMessage({
     type:'elementCopy',
     info:{clickedNodeId:nodeState.clickedNodeId}
   },"*")
}

const onDelete = ()=>{
  nodeState.iframeWin.postMessage({
    type:'elementDelete',
    info:{clickedNodeId:nodeState.clickedNodeId}
  },"*")
}

</script>

<template>
  <div
      v-if="nodeState.currentHoveredId && nodeState.currentHoveredId !==nodeState.clickedNodeId && !nodeState.isDrag"
      class="absolute z-850 cursor-move"
      :style="styleCompute"
      :class="[{'pointer-events-none':!nodeState.isDrag},{'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25':true}]">
    <div>
      <p class="absolute -top-20px text-blue-300 text-sm">{{ elementMap.get(nodeState.currentHoveredId)?.name }}</p>
    </div>
  </div>

  <div
      v-if="nodeState.clickedNodeId && !nodeState.isDrag"
      class="z-850 pointer-events-none bg-transparent border-solid border-2 border-blue-500 absolute "
      :style="clickStyleCompute"
  >
    <div
        class="absolute -right-2px !pointer-events-auto bg-white flex justify-center "
        :class="directionStyle"
    >
      <el-dropdown size="small" type="primary" trigger="hover" class="mr-2px">
        <el-button type="primary" size="small">{{ elementMap.has(nodeState.clickedNodeId) ?elementMap.get(nodeState.clickedNodeId).name:'' }}</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <HoverItem element-id="3">卡片</HoverItem>
            </el-dropdown-item>
            <el-dropdown-item>
              <HoverItem element-id="2">頁面</HoverItem>
            </el-dropdown-item>
            <el-dropdown-item>
              <HoverItem element-id="1">root</HoverItem>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button-group type="primary" size="small">
        <el-tooltip
            effect="dark"
            content="锁定"
            :offset="5"
            placement="top">
          <el-button>
            <el-icon :size="16">
              <lock/>
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
            effect="dark"
            content="复制"
            :offset="5"
            placement="top">
          <el-button @click="onCopy">
            <el-icon :size="16">
              <copy-document/>
            </el-icon>
          </el-button>
        </el-tooltip>
        <el-tooltip
            effect="dark"
            content="移除"
            :offset="5"
            placement="top">
          <el-button @click="onDelete">
            <el-icon :size="16">
              <delete/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>

  <div
      v-if="nodeState.pressNodeId.length > 0 && nodeState.isDrag"
      ref="el"
      class="absolute bg-gray-400 bg-opacity-50 select-none z-852"
      :style="pressStyleCompute"
  >
  </div>

  <div
      v-if="nodeState.isDrag"
      class="fixed cursor-move select-none bg-gray-500 w-auto px-40px z-1000"
      :style="dragStyleCompute"
  ><p class="text-sm">{{ nodeState.currentCursorName }}</p>
  </div>

  <div
      v-if="nodeState.isShowInsertion"
      class="absolute cursor-move select-none z-853"
      :class="{'bg-blue-500':nodeState.dragDirection !== 'center',
           'bg-blue-600 bg-opacity-50':nodeState.dragDirection === 'center',
        }"
      :style="dragInsertionStyleCompute"
  >
  </div>

</template>

