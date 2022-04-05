<script setup lang="ts">
import { defineProps, onMounted, onUnmounted, onUpdated, reactive, ref, watch, watchEffect } from 'vue'
import { onLongPress, useElementBounding, useMousePressed, useScroll, UseScrollReturn } from '@vueuse/core'
import {
  add,
  emitter,
  locationMap, move,
  nodeState,
  nodeStateOnHover, onCopy, onDelete,
  onDragEnd,
  onStartSelect, x, y
} from '@/views/lowCode/workbenchStatusMange'
import { vElementHover } from '@vueuse/components'
import useComponentHelp from '@/views/lowCode/componentHelp'

const props = defineProps({
  element: {
    type: Object,
    require: true,
    default: null
  }
})

const el = ref(null)
const location = reactive(useElementBounding(el))

const {onHover:onHover_}  = useComponentHelp(props, location)

function onHover (state: boolean) {
  onHover_(state)
}

const { pressed } = useMousePressed({ target: el })
const longPressed = ref(false)

onLongPress(el, () => {
  longPressed.value = true
  console.log('长按了',props.element.id)
  window.parent.postMessage(
      {
        type: 'onStartSelect'
      }, '*')
}, { delay: 200 })

watch(pressed, (n) => {
  if (n) {

  } else {
    console.log('长按结束了',props.element.id)
    longPressed.value = false
    window.parent.postMessage(
        {
          type: 'onDragEnd'
        }, '*')
  }
})

onMounted(() => {
  window.addEventListener('mousemove', (event)=>{
    x.value = event.clientX;
    y.value = event.clientY;
    window.parent.postMessage(
        {
          type: 'onMouseMove',
          x:x.value,
          y:y.value
        }, '*')
  })

  window.addEventListener('message', (event) => {
    let {type,location,element} = event.data;
    if (type === 'elementMove'){
      let {pressNodeId,dragElementId,dragDirection} = event.data.info;
      move(pressNodeId, dragElementId, dragDirection)
      window.parent.postMessage({
        type:'elementMove',
        elementId:pressNodeId
      },"*")
    }else if (type === 'elementAdd'){
      let {pressTypeId,dragElementId,dragDirection} = event.data.info;
      let addId = add(pressTypeId, dragElementId, dragDirection)
      window.parent.postMessage({
        type:'elementAdd',
        elementId:addId
      },"*")
    }if (type === 'elementCopy'){
      let {clickedNodeId} = event.data.info;
      let elementId = onCopy(clickedNodeId)
      window.parent.postMessage({
        type:'elementCopy',
        elementId:elementId
      },"*")
    }if (type === 'elementDelete'){
      let {clickedNodeId} = event.data.info;
      onDelete(clickedNodeId)
      window.parent.postMessage({
        type:'elementDelete',
        elementId:clickedNodeId
      },"*")
    }
  });
})

</script>

<template>
  <div ref="el" v-element-hover="onHover" class="!min-h-100vh flex !flex-col">
    <slot></slot>
  </div>
</template>
