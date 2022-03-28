<script setup lang="ts">
import { useConfigStore } from '@/stores/constant'
import { computed, defineEmits, defineProps, ref } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'

const store = useConfigStore()
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
    type: String,
    required: false,
    default: '300'
  },
  title: {
    type: String,
    required: true
  }
})

const isAffix = ref(props.isAffix)
const emit = defineEmits(['onPanelClose'])
const getHeight = computed(() => {
  return (height.value - store.value.headerHeight) + 'px'
})

const onPanelClose = () => {
  emit('onPanelClose')
}

const onAffix = () => {
  isAffix.value = !isAffix.value
}

const target = ref(null)
onClickOutside(target, () => {
  if (props.isVisible) {
    emit('onPanelClose')
  }
})

</script>

<template>
  <div v-if="isVisible" :class="[isAffix ? 'relative' : 'absolute']" ref="target"
       class='z-1'
       :style="{left:(isAffix?0:store.asideWidth)+'px',height:getHeight,top:store.headerHeight,width:width+'px'}">
    <el-card class="h-full" :body-style="{padding:0}">
      <template #header>
        <div class="flex justify-between">
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
      </template>
      <slot></slot>
    </el-card>
  </div>
</template>
