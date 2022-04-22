<script setup lang="ts">
import { ref, Ref } from 'vue'
import {
  Card, CardProp
} from '@/views/designer/interface/component'
import { usePropsWatcher } from '@/views/designer/propsWatcher'
import SwitchConfig from '@/views/designer/config/SwitchConfig.vue'
import StringConfig from '@/views/designer/config/StringConfig.vue'
import { Switch } from '@element-plus/icons-vue'
import VariableConfig from '@/views/designer/config/VariableConfig.vue'
import { ValueType } from '@/views/lowCode/service'

const props = defineProps<{
  component: Ref<Card>
}>()

const { config } = usePropsWatcher(() => new CardProp(), props.component)

const onMenuItemSelect = (idx: ValueType) => {
  config.value.title.idx = idx
}

</script>

<template>
  <div class="!mx-12px flex gap-x-1 items-center">
    <span class="text-sm text-left w-70px">开启头部</span>
    <div class="flex-grow">
      <SwitchConfig :prop="config.enableHeader"></SwitchConfig>
    </div>
  </div>

  <div class="!mx-12px flex gap-x-1 items-center" v-if="config.enableHeader.options[config.enableHeader.idx]">
    <p class="text-sm text-left w-70px">标题</p>
    <div class="flex-grow">
      <StringConfig :prop="config.title"></StringConfig>
      <VariableConfig :prop="config.title"></VariableConfig>
    </div>
    <el-popover
        placement="left-start"
        popper-class="!p-0"
        trigger="click"
        class="!p-0"
    >
      <template #reference>
        <el-button type="text">
          <el-icon :size="16">
            <Switch/>
          </el-icon>
        </el-button>
      </template>
      <div class="flex flex-col">
        <el-menu :default-active="config.title.idx"
                 @select="onMenuItemSelect">
          <el-menu-item class="!h-36px" v-for="(key,idx) in config.title.options" :index="idx">{{ idx }}</el-menu-item>
        </el-menu>
      </div>
    </el-popover>
  </div>

</template>

<style scoped>


</style>
