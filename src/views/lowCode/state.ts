import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { Component, ControlState, Direction, LocationState, Root, } from '@/views/lowCode/service'
import { usePointer } from '@vueuse/core'
import mitt from 'mitt'

export const locationState = ref<LocationState>(new LocationState())
export const renderPage = ref<Component>(new Root())
export const controlState = ref<ControlState>(new ControlState())
export const isInside = ref(false)
export const iframeWin = ref<any>(null)
export const asideHoverType = ref<string | null>(null)

export const emitter = mitt()
export const {
  x,
  y
} = usePointer()

export const point = reactive({
  x: 0,
  y: 0
})

export const componentMap = new Map()

export function updateComponentMap (renderPage: Component) {
  if (!renderPage){
    return
  }
  componentMap.clear()
  function doBuild (component: Component, level: number = 0) {
    component.level = level
    componentMap.set(component.id, component)
    component.children?.forEach(child => {
      child.pid = component.id
      doBuild(child, level + 1)
    })
  }
    doBuild(renderPage, 0)

}

watch(renderPage, () => {
  updateComponentMap(renderPage.value)
}, {
  deep: true
})

const isSubElement = (pressNodeId: string | undefined, dragElementId: string | undefined) => {
  if (pressNodeId === dragElementId) {
    return true
  }
  let element = componentMap.get(pressNodeId)
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
  let pressGroup = pressId ? componentMap.get(pressId).group : controlState.value.asideComponentGroup;

  if (!controlState.value.isDrag || !hoverId) {
    return false
  }

  // 如果是子元素 不允許
  if (!controlState.value.asideComponentType && isSubElement(pressId, hoverId)) {
    return false
  }

  if (controlState.value.direction === 'center') {
    // 如果这个容器已经存在子元素时 或者不支持這個分類
    let e = componentMap.get(hoverId)
    if (!e || e.children.length > 0 || e.supportDirection.indexOf('center') < 0|| e.supportGroup.indexOf(pressGroup) < 0) {
      return false
    } else {
      return true
    }
  }

  // 这个组件的父组件支持这个方向的操作
  let pElement = componentMap.get(componentMap.get(hoverId)?.pid)
  if (!pElement) {
    return false
  }

  if (pElement.supportDirection.indexOf(<Direction>controlState.value.direction) < 0 || pElement.supportGroup.indexOf(pressGroup) < 0) {
    return false
  }

  return true
})

watchEffect(() => {
  // console.log(controlState.value.x,controlState.value.y)
  point.x = controlState.value.x + 80
  point.y = controlState.value.y + 70
})
