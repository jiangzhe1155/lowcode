import { computed, reactive, ref, watchEffect } from 'vue'
import { Component, ControlState, Direction, LocationState, RenderPage } from '@/views/lowCode/service'
import { useMouse } from '@vueuse/core'
import { elementMap } from '@/views/lowCode/workbenchStatusMange'
import { Str } from 'windicss/types/lang/tokens'

export const locationState = ref<LocationState>(new LocationState())
export const renderPage = ref<RenderPage>(new RenderPage())
export const controlState = ref<ControlState>(new ControlState())
export const isInside = ref(false)

export const {
  x,
  y
} = useMouse()

export const point = reactive({
  x: 0,
  y: 0
})

const isSubElement = (pressNodeId: string | undefined, dragElementId: string | undefined) => {
  if (pressNodeId === dragElementId) {
    return true
  }
  let element = elementMap.get(pressNodeId)
  if (element && element.children) {
    for (let child of element.children) {
      if (isSubElement(child.id, dragElementId)) {
        return true
      }
    }
  }
  return false
}

export const isShowInsertion = computed(() => {
  let pressId = locationState.value.currentPressComponent?.id
  let hoverId = locationState.value.currentHoverComponent?.id

  if (!controlState.value.isDrag || !pressId || !hoverId) {
    return false
  }

  // 如果是子元素 不允許
  if (isSubElement(pressId, hoverId)) {
    return false
  }

  if (controlState.value.direction === 'center') {
    // 如果这个容器已经存在子元素时
    let e = componentMap.value.get(hoverId)
    if (!e || e.children.length > 0 || e.supportDirection.indexOf('center') < 0) {
      return false
    } else {
      return true
    }
  }

  // 这个组件的父组件支持这个方向的操作
  let pElement = componentMap.value.get(componentMap.value.get(hoverId)?.pid)
  if (!pElement) {
    return false
  }

  let i = pElement.supportDirection.indexOf(<Direction>controlState.value.direction)

  if (i < 0) {
    return false
  }

  return true
})

watchEffect(() => {
  // console.log(controlState.value.x,controlState.value.y)
  point.x = controlState.value.x + 80
  point.y = controlState.value.y + 70
})

export const componentMap = computed(() => {
  let models = renderPage.value.models
  let components = renderPage.value.components
  let map = new Map<String | undefined, Component>()

  function doBuild (component: Component, level: number = 0) {
    component.level = level
    map.set(component.id, component)
    component.children?.forEach(child => {
      child.pid = component.id
      doBuild(child, level + 1)
    })
  }

  for (let component of components) {
    doBuild(component)
  }
  for (let model of models) {
    doBuild(model)
  }
  return map
})
