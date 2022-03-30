import { createGlobalState, useStorage } from '@vueuse/core'

export const useConfigStore = createGlobalState(
  () => useStorage('config', {
    headerHeight: 50,
    asideWidth: 60
  }),
)


