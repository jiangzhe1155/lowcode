<script setup lang="ts">
import { Operation, PieChart } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/constant'
import { onMounted, reactive, ref} from 'vue'
import LowCodePanel from '@/views/lowCode/aside/LowCodePanel.vue'
import ComponentRepositoryCard from '@/views/lowCode/aside/ComponentRepositoryCard.vue'
import ComponentRepositoryCode from '@/views/lowCode/aside/ComponentRepositoryCode.vue'

import ComponentTree from '@/views/lowCode/aside/ComponentTree.vue'

import { emitter} from '@/views/designer/common'

const store = useConfigStore()
const el = ref()
const state = reactive({
  treeTabShow: false,
  componentTabShow: false,
  componentIsAffix: false,
  componentCodeShow: false,
})

onMounted(() => {
  emitter.on('onComponentPanelClose', () => {
    console.log(el.value.isAffix)
    if (!el.value.isAffix) {
      state.componentTabShow = false
    }
  })
  emitter.on('onComponentPanelOpen', () => {
    if (!el.value.isAffix) {
      state.componentTabShow = true
    }
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
      <el-menu-item index="3" @click="state.componentCodeShow = !state.componentCodeShow">
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
    <ComponentTree></ComponentTree>
  </LowCodePanel>
  <LowCodePanel
      ref="el"
      v-model:is-visible="state.componentTabShow"
      width=500
      title="组件库"
      @on-panel-close="state.componentTabShow = false"
  >
    <ComponentRepositoryCard>
    </ComponentRepositoryCard>
  </LowCodePanel>

  <LowCodePanel
      v-model:is-visible="state.componentCodeShow"
      width=500
      title="源码"
      @on-panel-close="state.componentCodeShow = false"
  >
    <ComponentRepositoryCode></ComponentRepositoryCode>
  </LowCodePanel>
</template>
<style>
</style>
