<script setup lang="ts">
import { ref } from 'vue'
import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/mode/javascript/javascript.js'
import { renderPage } from '@/views/designer/common'

const queryText = ref(renderPage.value.state)

const cmOptions = {
  mode: 'text/javascript', // Language mode
  theme: 'default', // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 2, // The smart indent unit is 2 spaces in length
  foldGutter: true, // Code folding
  styleActiveLine: true, // Display the style of the selected row
}

</script>

<template>
  <Codemirror
      class="text-left"
      v-model:value="renderPage.state"
      :options="cmOptions"
      placeholder="test placeholder"
      height="800"
      @change=""
  />
</template>

<style scoped>


</style>
