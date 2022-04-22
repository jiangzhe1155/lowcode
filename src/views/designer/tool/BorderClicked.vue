<script setup lang="ts">

import { computed } from 'vue'
import {
  locationState,
  componentMap,
  copy,
  fetchLocation,
  deleteComponent, isDragging, hide, resetLocationState
} from '@/views/designer/common'
import HoverItem from '@/views/lowCode/aside/HoverItem.vue'
import { CopyDocument, Delete, Lock, Hide } from '@element-plus/icons-vue'
import { Component } from '../interface/component'

const clickStyle = computed(() => {
  let location = locationState.currentClickComponent?.location
  return {
    width: location?.width + 'px',
    height: location?.height + 'px',
    left: location?.left + 'px',
    top: location?.top + 'px'
  }
})

const directionStyle = computed(() => {
  let location = locationState.currentClickComponent?.location
  if (!location || !location.top) {
    return {}
  }
  return {
    '-top-26px': location.top > 100
  }
})

const parentComponent = computed(() => {
  let parentComponents: Component[] = []
  let i = 0
  let componentId = componentMap.value.get(locationState.currentClickComponent?.id)?.pid
  if (!componentId) {
    return parentComponents
  }
  while (i < 3 && componentId.length > 0) {
    let pE = componentMap.value.get(componentMap.value.get(componentId).id)
    parentComponents.push(pE)
    componentId = pE.pid
    i++
  }
  return parentComponents
})

const onCopy = () => {
  let copyId = copy(locationState.currentClickComponent!.id)
  setTimeout(() => {
    locationState.currentClickComponent = fetchLocation(copyId)
  }, 200)
}

const onHide = () => {
  hide(locationState.currentClickComponent!.id)
}

const onDelete = () => {
  deleteComponent(locationState.currentClickComponent!.id)
  resetLocationState()
}

</script>
<template>
  <div
      v-if="locationState.currentClickComponent && !isDragging"
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
            <el-dropdown-item v-for="c in parentComponent">
              <HoverItem :element-id="c.id">{{ c.name }}</HoverItem>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-button-group type="primary" size="small"
                       v-if="componentMap.get(locationState.currentClickComponent?.id)?.group !== 'Root'">
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
            content="隐藏"
            :offset="5"
            placement="top">
          <el-button @click="onHide">
            <el-icon :size="16">
              <Hide/>
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
</template>

<style scoped>

</style>
