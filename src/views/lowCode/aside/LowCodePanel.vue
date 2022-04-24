<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'
import { isAffixPanel, isPanelOpen } from '@/views/designer/common'
import { designerConfig } from '@/stores/constant'

const { height } = useWindowSize()
const props = defineProps<{
  panel: {
    visible: boolean,
    affix: boolean,
    width: number,
    title: string
  }
}>()

const getHeight = computed(() => {
  return (height.value - designerConfig.headerHeight) + 'px'
})

const onPanelClose = () => {
  props.panel.visible = false
}

const onAffix = () => {
  props.panel.affix = !props.panel.affix
  isAffixPanel.value = props.panel.affix
}

const target = ref(null)
onClickOutside(target, () => {
  if (props.panel.visible && !props.panel.affix) {
    onPanelClose()
  }
})

watchEffect(() => {
  isPanelOpen.value = props.panel.visible
})

</script>

<template>
  <div
      v-if="panel.visible"
      ref="target"
      :class="[panel.affix ? 'relative' : 'absolute']"
      :style="{left:(panel.affix?0:designerConfig.asideWidth)+'px',height:getHeight,top:designerConfig.headerHeight,width:panel.width+'px'}"
      class="h-full z-900 bg-white border-1">
    <div class="flex justify-between p-20px">
      <p class="text-xl ">{{ panel.title }}</p>
      <el-button-group>
        <el-button type="text" @click="onAffix">
          <i v-if="panel.affix" class="text-2xl iconfont el-icon-alibuguding"></i>
          <i v-else class="text-2xl iconfont el-icon-aliguding-copy"></i>
        </el-button>
        <el-button type="text" @click="onPanelClose">
          <i class="text-2xl iconfont el-icon-alishanchu2"></i>
        </el-button>
      </el-button-group>
    </div>
    <div class="absolute top-72px left-0 bottom-0 right-0 !overflow-y-auto border-t-1">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>

</style>
