<script setup lang="ts">

import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import { nodeState ,locationMap} from '@/views/lowCode/workbenchStatusMange'</script>

<template>

  <RootContainer>
    <PageContainer>
      <CardComponent :element="{id:'3'}">
      </CardComponent>
      <CardComponent :element="{id:'4'}" >
      </CardComponent>
    </PageContainer>
  </RootContainer>
</template>

<style scoped>

</style>
