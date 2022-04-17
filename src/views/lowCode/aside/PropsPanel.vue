<script setup lang="ts">

import { componentMap, locationState } from '@/views/designer/common'
import { computed, h, resolveComponent } from 'vue'

const targetComponent = computed(() => {
  return componentMap.value.get(locationState.currentClickComponent?.id)
})

const renderFunc = () => {
  let component = resolveComponent(targetComponent.value.type + 'Config')
  return h(component, { component: targetComponent })
}

</script>

<template>
  <div v-if="!targetComponent">
    请在左侧选中组件
  </div>
  <div v-if="targetComponent">
    <renderFunc/>
  </div>
</template>
