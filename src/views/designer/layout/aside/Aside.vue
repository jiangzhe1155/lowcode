<script lang="ts" setup>
import { Operation, PieChart } from '@element-plus/icons-vue'
import { h, markRaw, onMounted, reactive, ref, resolveComponent } from 'vue'
import LowCodePanel from '@/views/lowCode/aside/LowCodePanel.vue'
import ComponentRepositoryCard from '@/views/lowCode/aside/ComponentRepositoryCard.vue'
import ComponentRepositoryCode from '@/views/lowCode/aside/ComponentRepositoryCode.vue'
import { designerConfig } from '@/stores/constant'
import ComponentTree from '@/views/lowCode/aside/ComponentTree.vue'

import { emitter } from '@/views/designer/common'

const panelProps = reactive([
  {
    title: '结构树',
    width: 500,
    visible: false,
    affix: false,
    render: markRaw(ComponentTree),
    icon: markRaw(Operation)
  }, {
    title: '组件库',
    width: designerConfig.dragPanelWidth,
    visible: false,
    affix: false,
    render: markRaw(ComponentRepositoryCard),
    icon: markRaw(PieChart)

  }, {
    title: '源码',
    width: 500,
    visible: false,
    affix: false,
    render: markRaw(ComponentRepositoryCode),
    icon: markRaw(PieChart)
  }
])

onMounted(() => {
  emitter.on('onComponentPanelClose', () => {
    if (panelProps[1].affix) {
      return
    }
    panelProps[1].visible = false
  })
  emitter.on('onComponentPanelOpen', () => {
    if (panelProps[1].affix) {
      return
    }
    panelProps[1].visible = true
  })
})

const onPanelClick = (idx: number) => {
  for (let valueElement of panelProps) {
    valueElement.visible = false
  }
  panelProps[idx].visible = !panelProps[idx].visible
}
</script>

<template>
  <el-aside :width="designerConfig.asideWidth +'px'" class="!h-full">
    <el-menu :collapse="true" class="!w-full">
      <el-menu-item v-for="(panel,idx) in panelProps" :index="panel.title" @click="onPanelClick(idx)">
        <el-icon>
          <component :is="panel.icon"></component>
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-aside>

  <LowCodePanel v-for="(panel,idx) in panelProps" :key="idx"
                :panel="panel">
    <component :is="panel.render"></component>
  </LowCodePanel>

</template>
<style>
</style>
