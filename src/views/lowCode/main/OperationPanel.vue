<script setup lang="ts">

import { computed, reactive, ref } from 'vue'
import ElementRender from '../component/ElementRender.vue'
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'
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
</script>

<template>
    <RootContainer>
        <PageContainer>
            <CardComponent>
            </CardComponent>
        </PageContainer>
    </RootContainer>
</template>

<style scoped>

</style>
