import { createGlobalState, useStorage } from '@vueuse/core'

export const useConfigStore = createGlobalState(
  () => useStorage('config', {
    headerHeight: 48,
    asideWidth: 60
  }),
)


