<script setup lang="ts">

import { reactive } from 'vue'
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import RootContainer from '@/views/lowCode/component/RootContainer.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
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
