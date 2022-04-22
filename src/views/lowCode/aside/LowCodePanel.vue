<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'
import { isAffixPanel, isPanelOpen } from '@/views/designer/common'
import { designerConfig } from '@/stores/constant'

const { height } = useWindowSize()

const props = defineProps({
  isAffix: {
    type: Boolean,
    required: false,
    default: false
  },
  isVisible: {
    type: Boolean,
    required: true,
    default: true
  },
  width: {
    type: Number,
    required: false,
    default: 300
  },
  title: {
    type: String,
    required: true
  }
})

const isAffix = ref(props.isAffix)
const emit = defineEmits(['onPanelClose'])
const getHeight = computed(() => {
  return (height.value - designerConfig.headerHeight) + 'px'
})

const onPanelClose = () => {
  emit('onPanelClose')
}

const onAffix = () => {
  isAffix.value = !isAffix.value
  isAffixPanel.value = isAffix.value
}

const target = ref(null)
onClickOutside(target, () => {
  if (props.isVisible && !isAffix.value) {
    onPanelClose()
  }
})

defineExpose({
  isAffix
})

watchEffect(() => {
  isPanelOpen.value = props.isVisible
})

</script>

<template>
  <div
      ref="target"
      class="h-full z-900 bg-white border-1"
      :class="[isAffix ? 'relative' : 'absolute']"
      v-if="isVisible"
      :style="{left:(isAffix?0:designerConfig.asideWidth)+'px',height:getHeight,top:designerConfig.headerHeight,width:width+'px'}">
    <div class="flex justify-between p-20px">
      <p class="text-xl ">{{ title }}</p>
      <el-button-group>
        <el-button type="text" @click="onAffix">
          <i v-if="isAffix" class="text-2xl iconfont el-icon-alibuguding"></i>
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
