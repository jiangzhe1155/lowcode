<script setup lang="ts">
import { computed, defineProps, getCurrentInstance, h, onMounted, onUnmounted, ref, resolveComponent } from 'vue'
import { useElementBounding, useElementHover } from '@vueuse/core'

const props = defineProps({
  element:{
    type:Object,
    require:true,
    default:null
  }
})
const resolve = resolveComponent(props.element.type);
const render = () => h(resolve,{element:props.element}, ()=>
    props.element.children.map(e => h(resolveComponent('ElementRender'), { element: e }))
);
</script>

<template>
    <render/>
</template>

<style scoped>

</style>
