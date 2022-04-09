<script setup lang="ts">
import OperationPanel2 from '@/views/lowCode/main/OperationPanel2.vue'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'

const onCLick = () => {
  console.log('点击事件')
  window.parent.postMessage(
      {
        type: 'onClick',
      }, '*')
}
</script>

<template>
  <OperationPanel @click="onCLick">
  </OperationPanel>
</template>
<style scoped>

</style>
