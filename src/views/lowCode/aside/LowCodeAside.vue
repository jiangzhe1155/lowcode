<script setup lang="ts">
import { Operation, PieChart } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/constant'
import { onMounted, reactive, ref } from 'vue'
import LowCodePanel from '@/views/lowCode/aside/LowCodePanel.vue'
import ComponentRepositoryCard from '@/views/lowCode/aside/ComponentRepositoryCard.vue'
import { controlState, emitter, iframeRef, iframeWin } from '@/views/lowCode/state'
import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'

const store = useConfigStore()
const el = ref()
const state = reactive({
  treeTabShow: false,
  componentTabShow: false,
  componentIsAffix: false
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

  window.addEventListener('mousemove', (event: MouseEvent) => {
    if (controlState.value.isLongPress) {
      if (!controlState.value.isDrag) {
        controlState.value.isDrag = true
        sendIframeMessage(iframeWin.value, 'onStartDrag', {
          componentType: controlState.value.asideComponentType,
          componentGroup: controlState.value.asideComponentGroup
        })
      } else {
        console.log('正在移動在')
      }
    }
  }, true)

  window.addEventListener('drag', (event: MouseEvent) => {
      console.log('正在被拖拽',event)
  }, true)

})

addMessageListener('onDragEnd', () => {
  emitter.emit('onComponentPanelOpen')
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
      ref="el"
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
