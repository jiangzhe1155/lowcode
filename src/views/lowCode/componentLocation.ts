import { onMounted, onUpdated, reactive, ref } from 'vue'
import { Component } from '@/views/lowCode/service'
import { useElementBounding } from '@vueuse/core'

const locationMap = reactive(new Map())

export function useComponentLocation (component: Component, el: any) {
  const location = reactive(useElementBounding(el))

  onMounted(() => {
    console.log(`${component.id} 初始化成功,更新位置`)
    locationMap.set(component.id, location)
  })

  onUpdated(() => {
    console.log(`${component.id} 初始化成功,更新位置`)
    locationMap.set(component.id, location)
  })

  return
}

