import { useStorage } from '@vueuse/core'

export function useRenderPageData(pageId:string) {
  const state = useStorage(pageId, {} , sessionStorage)
  state.value = {asdasd:'1123213123'}
  return {state}
}
