<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import { onLongPress, useMousePressed } from '@vueuse/core'
import { controlState, emitter } from '@/views/lowCode/state'
import { ComponentGroup, ComponentType } from '@/views/lowCode/service'
import { asideComponentType,asideComponentGroup } from '@/views/designer/common'

const props = defineProps<{
  type: ComponentType,
  group: ComponentGroup,
  name: string,
  imgUrl: string,
}>()

const el = ref<HTMLElement | null>(null)

onLongPress(el, () => {
  asideComponentType.value = props.type
  asideComponentGroup.value = props.group
  emitter.emit('onComponentPanelClose')
}, { delay: 200 })

const { pressed } = useMousePressed({ target: el })
watch(pressed, (n) => {
  if (n) {

  } else {
    asideComponentType.value = undefined
    asideComponentGroup.value = undefined
    emitter.emit('onComponentPanelOpen')
  }
})

</script>

<template>
  <el-card ref="el" shadow="hover" class="h-full">
    <el-image class="w-56px h-56px"
              :src="imgUrl">
    </el-image>
    <p>{{ name }}</p>
  </el-card>
</template>

<style scoped>

</style>
