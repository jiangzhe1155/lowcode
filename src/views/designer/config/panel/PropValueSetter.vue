<script setup lang="ts">
import { Check, Switch } from '@element-plus/icons-vue'
import { Indexable } from '@/views/designer/service/component'
import { ValueType } from '@/views/designer/service/service'
const props = defineProps<{
  prop: Indexable,
}>()

const onMenuItemSelect = (idx: ValueType) => {
  props.prop.idx = idx
}
</script>

<template>
  <el-popover
      class="!p-0"
      placement="left-start"
      popper-class="!p-0"
      trigger="hover"
  ><template #reference>
    <el-button type="text" v-if="Object.keys(prop.options).length>1">
      <el-icon :size="16">
        <Switch/>
      </el-icon>
    </el-button>
  </template>
    <div class="flex flex-col">
      <el-menu :default-active="prop.idx"
               @select="onMenuItemSelect">
        <el-menu-item v-for="(key,idx) in prop.options" :index="idx" class="!h-36px !pl-10px !pr-0">
          <div class="flex">
            <div class="w-32px">
              <el-icon v-if="idx === prop.idx"><Check /></el-icon>
            </div>
            <div class="flex-grow">
              {{ idx }}
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>
  </el-popover>
</template>

<style scoped>

</style>
