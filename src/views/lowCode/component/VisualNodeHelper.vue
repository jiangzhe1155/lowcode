<script setup lang="ts">
import { computed, defineProps, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { vElementHover } from '@vueuse/components'

import { CopyDocument, Delete, Lock } from '@element-plus/icons-vue'
import HoverItem from '@/views/lowCode/component/HoverItem.vue'
import {
  nodeStateOnClick,
  nodeState,
  locationMap,
  elementMap
} from '@/views/lowCode/workbenchStatusMange'
import { toReactive, useMousePressed } from '@vueuse/core'
import { Num } from 'windicss/types/lang/tokens'


const props = defineProps({
  scrollY: {
    type: Number,
    require: true,
    default: 0
  }
})

const styleCompute = computed(() => {
  let location = locationMap.get(nodeState.currentHoveredId)
  if (!location) {
    return {
      top: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
  return {
    top: location.top-70-1 +props.scrollY+ 'px',
    width: location.width + 'px',
    height: location.height + 'px',
    left: location.left-80-1  + 'px'
  }
})

const clickStyleCompute = computed(() => {
  let location = locationMap.get(nodeState.clickedNodeId)
  if (!location) {
    return {
      top: 0,
      width: 0,
      height: 0,
      left: 0
    }
  }
  return {
    top: location.top-70-1 + props.scrollY + 'px',
    width: location.width + 'px',
    height: location.height + 'px',
    left: location.left-80-1  + 'px'
  }
})

</script>
<template>
  <div
      v-if="nodeState.currentHoveredId && nodeState.currentHoveredId !==nodeState.clickedNodeId"
      class="absolute"
      :style="styleCompute"
      :class="[{'pointer-events-none':true},{'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25':true}]">
    <p class="absolute -top-20px text-blue-300 text-sm">{{ elementMap.get(nodeState.currentHoveredId).name }}</p>
  </div>

  <div
      v-if="nodeState.clickedNodeId"
      class="pointer-events-none bg-transparent border-solid border-2 border-blue-500 absolute "
      :style="clickStyleCompute"
  >
    <div class="z-20 absolute -top-26px -right-2px !pointer-events-auto bg-white flex justify-center ">
      <el-dropdown size="small" type="primary" trigger="hover" class="mr-2px">
        <el-button type="primary" size="small">{{ elementMap.get(nodeState.clickedNodeId).name }}</el-button>
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
          <el-button>
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
          <el-button>
            <el-icon :size="16">
              <delete/>
            </el-icon>
          </el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>

