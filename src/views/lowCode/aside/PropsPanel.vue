<script setup lang="ts">

import { componentMap, locationState } from '@/views/designer/common'




</script>

<template>
  <div>
    属性面板 {{componentMap.get(locationState.currentClickComponent?.id)?.name}}
  </div>
</template>
