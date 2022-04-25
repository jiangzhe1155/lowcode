<script lang="ts" setup>
import { Operation, PieChart } from '@element-plus/icons-vue'
import { markRaw, onMounted, reactive } from 'vue'
import AsidePanel from '@/views/designer/layout/aside/panel/AsidePanel.vue'
import ComponentRepository from '@/views/designer/layout/aside/panel/ComponentRepository/ComponentRepository.vue'
import ComponentCode from '@/views/designer/layout/aside/panel/componentCode/ComponentCode.vue'
import ComponentTree from '@/views/designer/layout/aside/panel/componentTree/ComponentTree.vue'
import { designerConfig } from '@/stores/constant'
import { emitter } from '@/views/designer/service/common'

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
    render: markRaw(ComponentRepository),
    icon: markRaw(PieChart)

  }, {
    title: '源码',
    width: 500,
    visible: false,
    affix: false,
    render: markRaw(ComponentCode),
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

  <AsidePanel v-for="(panel,idx) in panelProps" :key="idx"
              :panel="panel">
    <component :is="panel.render"></component>
  </AsidePanel>

</template>
<style>
</style>
