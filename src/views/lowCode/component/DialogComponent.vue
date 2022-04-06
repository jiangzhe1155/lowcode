<script setup lang="ts">
import {
  defineProps,
  ref,
  reactive, onMounted, toRaw, watch, onUpdated,

} from 'vue'
import { useElementBounding } from '@vueuse/core'
import useComponentHelp from '@/views/lowCode/componentHelp'
import { sortUserPlugins } from 'vite'

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

onMounted(() => {
  console.log(el)
})

const location = reactive({})

const onOpen = () => {
  console.log('打開了', el.value)
  let elementsByClassName = document.getElementById('dialog_data').firstElementChild.firstElementChild.firstElementChild
  console.log(elementsByClassName.offsetWidth, elementsByClassName.offsetHeight, elementsByClassName.offsetLeft, elementsByClassName.offsetTop)

  location.width = elementsByClassName.offsetWidth
  location.height = elementsByClassName.offsetHeight
  location.top = elementsByClassName.offsetTop
  location.left = elementsByClassName.offsetLeft

  window.parent.postMessage(
      {
        type: 'locationChange',
        location: toRaw(location),
        elementId: props.element.id,
      }, '*')
}

const onClose = () => {
  console.log('关闭了')
  window.parent.postMessage(
      {
        type: 'locationChange',
        location: {
          width: 0,
          height: 0,
          top: 0,
          left: 0
        },
        elementId: props.element.id,
      }, '*')
}

const onClose2 = () => {
  let elementsByClassName = document.getElementById('dialog_data').firstElementChild.firstElementChild.firstElementChild
  console.log(elementsByClassName.offsetWidth, elementsByClassName.offsetHeight, elementsByClassName.offsetLeft, elementsByClassName.offsetTop)
}

</script>

<template>
  <div id="dialog_data">
    <el-dialog
        ref="el" v-model="dialogVisible" title="Tips" width="30%" destroy-on-close @mouseenter="onClose2"
        @opened="onOpen" @closed="onClose">
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

