<script setup lang="ts">
import { getCurrentInstance, onMounted, ref } from 'vue'
import Codemirror from 'codemirror-editor-vue3'
// language
import 'codemirror/mode/javascript/javascript.js'

const queryText = ref('')

const cmOptions = {
  mode: 'text/javascript', // Language mode
  theme: 'default', // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 1, // The smart indent unit is 2 spaces in length
  foldGutter: true, // Code folding
  styleActiveLine: true, // Display the style of the selected row
}
let { ctx: that } = getCurrentInstance()


</script>

<template>
  <Codemirror
      class="text-left"
      v-model:value="queryText"
      :options="cmOptions"
      placeholder="test placeholder"
      height="800"
      @change=""
  />
</template>

<style scoped>


</style>
