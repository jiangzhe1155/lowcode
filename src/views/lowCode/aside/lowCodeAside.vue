<script setup lang="ts">
import { Operation, PieChart } from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/constant'
import { computed, reactive } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { height } = useWindowSize()
const store = useConfigStore()

const state = reactive({
  'treeTabShow': false,
  'componentTabShow': false
})

const getH = computed(() => {
  return (height.value - 100) + 'px'
})

const getLeftOffset = computed(() => {
  return (store.value.asideWidth + 10) + 'px'
})

</script>
<template>
  <el-aside class="!h-full " :width="store.asideWidth +'px'">
    <el-menu :collapse="true" class="!w-full">
      <el-menu-item index="1" @click="state.treeTabShow = !state.treeTabShow">
        <el-icon>
          <Operation/>
        </el-icon>
        <template #title>结构树</template>
      </el-menu-item>
      <el-menu-item index="2" @click="state.componentTabShow = !state.componentTabShow">
        <el-icon>
          <PieChart/>
        </el-icon>
        <template #title>组件库</template>
      </el-menu-item>
    </el-menu>
  </el-aside>
  <el-card v-if="state.treeTabShow" class="box-card absolute w-108" :style="{height:getH,left:getLeftOffset}">
    结构树
  </el-card>
  <el-card v-if="state.componentTabShow" class="box-card absolute w-108" :style="{height:getH,left:getLeftOffset}">
    组件库
  </el-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LowCodeAside'
})

</script>

<style scoped>

</style>
