<script setup lang="ts">
import { defineProps, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { useElementBounding, useElementHover } from '@vueuse/core'
const { proxy } = getCurrentInstance() as any;
import { vElementHover } from '@vueuse/components'


const props = defineProps({
  element:{
    type:Object,
    require:true,
    default:null
  }
})

const el = ref()
const { x, y, top, right, bottom, left, width, height } = useElementBounding(el)

const isClick = ref(false);
console.log(props.element)
const onClick = () => {
  isClick.value = true;
  isHovered.value = false;
  proxy.mittBus.emit('clickRenderBox',props.element);
}

const isHovered = ref(false)
function onHover(state: boolean) {
  let oldState = isHovered.value;
  isHovered.value = state;
  if (!oldState && state){
    console.log('移动进了2')
  }
}

onMounted(()=>{
  proxy.mittBus.on('clickRenderBox', (element:any) => {
    if (element.id !== props.element.id){
      isClick.value = false;
      isHovered.value = false;
    }
  });
})

onUnmounted(() => {
  proxy.mittBus.off('clickRenderBox', () => {});
});

</script>

<template>
  <div v-if="!isClick && isHovered" class="absolute z-2"
       :class="'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25'"
       :style="{top:top,left:left,width:width+'px',height:height+'px'}"
  >
  <div>{{ props.element.type}}</div>
  </div>
  <el-container  v-on:click.stop="onClick" ref="el" v-element-hover="onHover">
    <slot>asdasdasd</slot>
    {{isHovered}}{{element.id}}
  </el-container>
</template>
