<script setup lang="ts">
import { Operation, PieChart } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/constant'
import { onMounted, reactive } from 'vue'
import LowCodePanel from '@/views/lowCode/aside/LowCodePanel.vue'
import ComponentRepositoryCard from '@/views/lowCode/aside/ComponentRepositoryCard.vue'
import { emitter } from '@/views/lowCode/state'

const store = useConfigStore()
const state = reactive({
  treeTabShow: false,
  componentTabShow: false,
})

onMounted(() => {
  emitter.on('onComponentPanelClose', () => {
    state.componentTabShow = false
  })
  emitter.on('onComponentPanelOpen', () => {
    state.componentTabShow = true
  })
})

</script>

<template>
  <el-aside class="!h-full" :width="store.asideWidth +'px'">
    <el-menu :collapse="true" class="!w-full">
      <el-menu-item index="1" @click="state.treeTabShow = !state.treeTabShow">
        <el-icon>
          <Operation/>
        </el-icon>
      </el-menu-item>
      <el-menu-item index="2" @click="state.componentTabShow = !state.componentTabShow">
        <el-icon>
          <PieChart/>
        </el-icon>
      </el-menu-item>
    </el-menu>
  </el-aside>

  <LowCodePanel
      v-model:is-visible="state.treeTabShow"
      width=500
      title="结构树"
      @on-panel-close="state.treeTabShow = false"
  >
  </LowCodePanel>

  <LowCodePanel
      v-model:is-visible="state.componentTabShow"
      width=500
      title="组件库"
      @on-panel-close="state.componentTabShow = false"
  >
    <ComponentRepositoryCard>
    </ComponentRepositoryCard>
  </LowCodePanel>
</template>
<style>
</style>
