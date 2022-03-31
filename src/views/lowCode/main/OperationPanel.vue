<script setup lang="ts">

import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import { nodeState, nodeStateOnClick } from '@/views/lowCode/workbenchStatusMange'
import VisualNodeHelper from '@/views/lowCode/component/VisualNodeHelper.vue'

const onCLick = () => {
  nodeStateOnClick(nodeState.currentHoveredId)
}

</script>
<template>
  <RootContainer :element="{id:'1'}" @click="onCLick">
    <PageContainer :element="{id:'2'}">
      <CardComponent :element="{id:'3'}">
      </CardComponent>
      <CardComponent :element="{id:'4'}">
      </CardComponent>
    </PageContainer>
    <CardComponent :element="{id:'5'}">
    </CardComponent>
  </RootContainer>
</template>

<style scoped>

</style>
