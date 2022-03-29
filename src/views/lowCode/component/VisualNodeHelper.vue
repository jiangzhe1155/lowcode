<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useElementHover } from '@vueuse/core'
import { canHover, isClick, nodeStateOnClick } from '@/views/lowCode/workbenchStatusMange'
import { CopyDocument, Delete, Lock } from '@element-plus/icons-vue'

const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  name: {
    type: String,
    default: '虚拟边框'
  },
  elementId: {
    type: String,
    default: '0'
  }
})

const el = ref()
const isHovered = useElementHover(el)

const isShowHover = computed(() => {
  // 并且鼠标不在特定的区块
  return isHovered.value && canHover(props.elementId)
})

// 获取工具栏的矩形

</script>

<template>
  <div
      ref="el"
      class="absolute"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}"
      :class="{'pointer-events-none':!canHover(elementId)}"
      @click="nodeStateOnClick(elementId,props.location)">
    <div v-if="isShowHover" class="w-full h-full"
         :class="['border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25',{'pointer-events-none':!canHover(elementId)}]">
      <p class="absolute -top-20px text-blue-300 text-sm">{{ name }}</p>
    </div>
  </div>
  <div
      v-if="isClick(elementId)"
      class="z-2 pointer-events-none bg-transparent border-solid border-2 border-blue-500 absolute"
      :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}"
  >
    <div class="z-10 absolute -top-26px -right-2px !pointer-events-auto bg-white flex justify-center ">
      <el-dropdown size="small" type="primary" trigger="hover" class="mr-2px">
        <el-button type="primary" size="small">wqewq</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>page</el-dropdown-item>
            <el-dropdown-item>root</el-dropdown-item>
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

<style>
</style>
