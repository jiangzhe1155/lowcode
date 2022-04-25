<script setup lang="ts">
import { Button } from '@/views/designer/service/component'

const props = defineProps<{
  component: Button,
  state: any,
  payload?: any[]
}>()

const onClick = () => {
  eval(props.component.onclick)(...props.payload!)
}

</script>

<template>
  <el-button :type="component.type" @click="onClick" v-if="!component.confirm">
    {{ component.label }}
  </el-button>

  <el-popconfirm :title="`确认${component.label}?`" v-if="component.confirm">
    <template #reference>
      <el-button :type="component.type" @click="onClick">
        {{ component.label }}
      </el-button>
    </template>
  </el-popconfirm>
</template>

<style scoped>

</style>
