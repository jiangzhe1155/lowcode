<script setup lang="ts">
import OperationPanel2 from '@/views/lowCode/main/OperationPanel2.vue'
import OperationPanel from '@/views/lowCode/main/OperationPanel.vue'
import { onMounted } from 'vue'

const onCLick = () => {
  console.log('点击事件')
  window.parent.postMessage(
      {
        type: 'onClick',
      }, '*')
}

onMounted(() => {
  console.log('點擊了')
})

</script>

<template>
  <OperationPanel @click="onCLick">
  </OperationPanel>
</template>
<style scoped>

</style>
