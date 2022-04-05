<script setup lang="ts">
import {
  defineProps,
  ref,
  reactive,

} from 'vue'
import { useElementBounding} from '@vueuse/core'
import useComponentHelp from '@/views/lowCode/componentHelp'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

const el = ref(null)
// const location = useElementBounding(el)

// const {onHover:onHover_}  = useComponentHelp(props, location)

// function onHover (state: boolean) {
//   onHover_(state)
// }
const dialogVisible = ref(true)

</script>

<template>
<div>
  <el-dialog v-model="dialogVisible" title="Tips" width="30%">
    <span>It's a draggable Dialog</span>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false"
          >Confirm</el-button
          >
        </span>
    </template>
  </el-dialog>
</div>

</template>

