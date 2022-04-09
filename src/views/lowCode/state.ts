import { computed, reactive, ref, watchEffect } from 'vue'
import { Component, ControlState, LocationState, RenderPage } from '@/views/lowCode/service'
import { useMouse } from '@vueuse/core'

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

watchEffect(() => {
  // console.log('父鼠标移动事件')
  point.x = x.value
  point.y = y.value
})

watchEffect(() => {
  point.x = controlState.value.x + 80
  point.y = controlState.value.y + 70 - controlState.value.scroll
})

export const location = computed(() => {
  console.log(x.value, y.value)
  if (isInside.value) {
    return {
      x: controlState.value.x + 80,
      y: controlState.value.y + 70 - controlState.value.scroll
    }
  } else {
    return {
      x: x.value,
      y: y.value
    }
  }
})

export const componentMap = computed(() => {
  let models = renderPage.value.models
  let components = renderPage.value.components
  let map = new Map()

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
