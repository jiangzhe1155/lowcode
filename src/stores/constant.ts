import { createGlobalState, useStorage } from '@vueuse/core'
import { ref } from 'vue'

export const useConfigStore = createGlobalState(
  () => useStorage('config', {
    headerHeight: 100,
    asideWidth: 60
  }),
)

export const asideWidth = ref(48);
