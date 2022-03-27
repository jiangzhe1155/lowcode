<script setup lang="ts">
import { computed, defineProps, onMounted, watch, watchEffect } from 'vue'
import { Num } from 'windicss/types/lang/tokens'

defineProps({
  location:Object,
})

</script>

<template>
    <div
        class="absolute border-dashed border-1 border-light-blue-500 bg-light-blue-100 bg-opacity-25"
         :style="{top:location.top+'px',width:location.width+'px',height:location.height+'px',left:location.left+'px'}">
    </div>
</template>

<style>

</style>
