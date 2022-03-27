<script setup lang="ts">

import { computed, reactive, ref } from 'vue'
import ElementRender from '../component/ElementRender.vue'
const self = ref(null);

const renderJson = reactive({
    root:{
      id: 1,
      name:'页面',
      type:'RootContainer',
      slots:[],
      children:[]
    },
    modelBoxes:[

    ],
    components:[
      {
        id: 2,
        name:'通用容器',
        type:'PageContainer',
        children:[]
      }
    ]
  }
)

const getPage = computed(()=> {
  let res = Object.assign({},renderJson.root);
  res.children = renderJson.components;
  return res;
})

</script>

<template>
  <ElementRender :element="getPage">
  </ElementRender>
</template>

<style scoped>

</style>
