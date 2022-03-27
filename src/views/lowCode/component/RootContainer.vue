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
const { top, left, width, height } = useElementBounding(el)
const isHovered = ref(false)
const isClick = ref(false);

const onClick = () => {
  isClick.value = true;
  isHovered.value = false;
  proxy.mittBus.emit('clickRenderBox',props.element);
}

function onHover(state: boolean) {
  let oldState = isHovered.value;
  isHovered.value = state;
  if (!oldState && state){
    console.log('移动进了1')
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
  <div v-if="!isClick && isHovered" class="absolute z-100"
       :class="'border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25'"
       :style="{top:top+'px',left:left+'px',width:width+'px',height:height+'px'}"
  >{{ props.element.type}}

  </div>
  <div v-if="isClick" class="absolute"
       :class="'border-solid border-2 border-light-blue-500'" >
    {{ props.element.type }}
  </div>
  <div class="h-full" ref="el" v-element-hover="onHover">
    <slot>
    </slot>
    {{isHovered}}{{element.id}}
  </div>

</template>
