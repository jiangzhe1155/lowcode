<script setup lang="ts">
import {
  locationState,
  componentMap,
  isInside,
  controlState,
  point,
  x,
  y,
  isShowInsertion, iframeWin,
  asideHoverType
} from '@/views/lowCode/state'
import { computed, toRaw } from 'vue'

import { CopyDocument, Delete, Lock } from '@element-plus/icons-vue'
import HoverItem from '@/views/lowCode/component/HoverItem.vue'
import { sendIframeMessage } from '@/views/lowCode/iframeUtil'

const hoverStyle = computed(() => {
  let location = locationState.value.currentHoverComponent?.location
  // console.log('hover 样式 ', location)
  return {
    width: location?.width + 'px',
    height: location?.height + 'px',
    left: location?.left + 'px',
    top: location?.top + 'px'
  }
})

const clickStyle = computed(() => {
  let location = locationState.value.currentClickComponent?.location
  return {
    width: location?.width + 'px',
    height: location?.height + 'px',
    left: location?.left + 'px',
    top: location?.top + 'px'
  }
})

const directionStyle = computed(() => {
  let location = locationState.value.currentClickComponent?.location
  if (!location || !location.top) {
    return {}
  }
  return {
    '-top-26px': location.top > 100
  }
})

const dragStyle = computed(() => {
  return {
    left: point.x - 10 + 'px',
    top: point.y - 10 + 'px',
  }
})

const asideDragStyle = computed(() => {
  return {
    left: point.x - 20 + 'px',
    top: point.y - 10 + 'px',
  }
})

const pressStyleCompute = computed(() => {
  let location = locationState.value.currentPressComponent?.location
  return {
    width: location?.width + 'px',
    height: location?.height + 'px',
    left: location?.left + 'px',
    top: location?.top + 'px'
  }
})

const dragInsertionStyle = computed(() => {
  let {
    top,
    width,
    height,
    left
  } = locationState.value.currentHoverComponent?.location
  let direction = controlState.value.direction

  // console.log(locationState.value.currentHoverComponent?.location,direction,scrollY)
  width = direction == 'right' || direction == 'left' ? 4 : width
  height = direction == 'top' || direction == 'bottom' ? 4 : height
  left = direction == 'right' ? left + width - 4 : left
  top = direction == 'bottom' ? top + height - 4 : top

  return {
    width: width + 'px',
    height: height + 'px',
    left: left + 'px',
    top: top + 'px'
  }
})

const onCopy = () => {
  sendIframeMessage(iframeWin.value, 'componentCopy', { id: locationState.value.currentClickComponent?.id })
}

const onDelete = () => {
  sendIframeMessage(iframeWin.value, 'componentDelete', { id: locationState.value.currentClickComponent?.id })
}

</script>

<template>
  <div
      v-if="locationState.currentHoverComponent && locationState.currentHoverComponent.location.width && !controlState.isDrag"
      class="absolute"
      :style="hoverStyle"
      :class="[{'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25':true},'pointer-events-none']">
    <div>
      <p class="absolute -top-20px text-blue-300 text-sm">
        {{ componentMap.get(locationState.value?.currentHoverComponent.id) }}</p>
    </div>
  </div>

  <div
      v-if="locationState.currentClickComponent && locationState.currentClickComponent.location?.width && !controlState.isDrag"
      class="z-400 pointer-events-none bg-transparent border-solid border-2 border-blue-500 absolute "
      :style="clickStyle"
  >
    <div
        class="absolute -right-2px !pointer-events-auto bg-white flex justify-center "
        :class="directionStyle"
    >
      <el-dropdown size="small" type="primary" trigger="hover" class="mr-2px">
        <el-button type="primary" size="small">
          {{ componentMap.get(locationState.currentClickComponent?.id)?.name }}
        </el-button>
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
      v-if="controlState.isDrag && !controlState.asideComponentType"
      class="absolute bg-gray-400 bg-opacity-50 select-none z-4000 pointer-events-none select-auto cursor-move"
      :style="pressStyleCompute"
  >
  </div>

  <div
      v-if="controlState.isDrag"
      class="fixed bg-gray-500 w-auto px-40px z-4000  pointer-events-none	select-auto	cursor-move"
      :style="dragStyle"
  ><p class="text-sm cursor-move">{{ componentMap.get(locationState.currentPressComponent?.id)?.name }}</p>
  </div>


  <div
      v-if="controlState.asideComponentType "
      class="fixed bg-gray-500 w-auto px-40px z-4000  pointer-events-none	select-auto	cursor-move"
      :style="asideDragStyle"
  ><p class="text-sm cursor-move">{{ asideHoverType }}</p>
  </div>


  <div
      v-if="controlState.isDrag && isShowInsertion && isInside"
      class="absolute cursor-move select-none z-853"
      :class="{'bg-blue-500':controlState.direction !== 'center',
           'bg-blue-600 bg-opacity-50':controlState.direction === 'center',
        }"
      :style="dragInsertionStyle"
  >
  </div>


</template>

