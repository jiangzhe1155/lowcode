<script setup lang="ts">

import {
  ref
} from 'vue'

const props = defineProps({
  component: {
    type: Object,
    require: true,
    default: null
  }
})

const dialogVisible = ref(true)
const onClose = () => {
  console.log('关闭了')
}

</script>

<template>
  <div>
    <el-dialog
        v-model="dialogVisible" title="Tips" width="30%" destroy-on-close :modal="true" @closed="onClose">
      <span>It's a draggable Dialog</span>
      <slot></slot>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

