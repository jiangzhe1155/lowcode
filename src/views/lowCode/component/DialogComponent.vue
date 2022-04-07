<script setup lang="ts">

import {
  defineProps,
  ref,
  reactive

} from 'vue'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

const dialogVisible = ref(true)

// const onOpen = () => {
//   let elementsByClassName = document.getElementById('dialog_data').firstElementChild.firstElementChild.firstElementChild
//   console.log(elementsByClassName.offsetWidth, elementsByClassName.offsetHeight, elementsByClassName.offsetLeft, elementsByClassName.offsetTop)
//
//   location.width = elementsByClassName.offsetWidth
//   location.height = elementsByClassName.offsetHeight
//   location.top = elementsByClassName.offsetTop
//   location.left = elementsByClassName.offsetLeft
//
//   window.parent.postMessage(
//       {
//         type: 'locationChange',
//         location: toRaw(location),
//         elementId: props.element.id,
//       }, '*')
// }
//
// const onClose = () => {
//   console.log('关闭了')
//   window.parent.postMessage(
//       {
//         type: 'locationChange',
//         location: {
//           width: 0,
//           height: 0,
//           top: 0,
//           left: 0
//         },
//         elementId: props.element.id,
//       }, '*')
// }


</script>

<template>
  <div id="dialog_data">
    <el-dialog
        v-model="dialogVisible" title="Tips" width="30%" destroy-on-close>
      <span>It's a draggable Dialog</span>
      <slot><p class="bg-gray-200 p-10px select-none">拖拽组件或模板到这里</p></slot>
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

