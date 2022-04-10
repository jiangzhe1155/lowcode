import { computed, onMounted, reactive, toRaw, watch, watchEffect } from 'vue'
import { v4 } from 'uuid'
import { sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { Location } from '@/views/lowCode/componentLocation'
import { onLongPress, useMouse, useMousePressed, useScroll } from '@vueuse/core'

export function useRenderPageData (pageId?: string) {
  console.log(pageId)
  let page = new Page()
  let card = new Card('卡片1')
  card.children.push(new Card('卡片2'))
  page.children.push(new Card('卡片3'), card, new Card('卡片4'))
  let dialog = new Dialog()
  dialog.children.push(new Card('卡片6'))

  const renderPage: RenderPage = reactive({
    components: [page, new Card('卡片5')],
    models: [dialog]
  })

  const {
    x,
    y
  } = useMouse()

  const { y: scrollY } = useScroll(window)

  const locationState: LocationState = reactive(new LocationState())
  const controlState = reactive<ControlState>(new ControlState())

  watch(locationState, () => {
    sendIframeMessage(window.parent, 'locationStateChange', { locationState: toRaw(locationState) })
  })

  watchEffect(() => {
    sendIframeMessage(window.parent, 'renderPageUpdate', { renderPage: toRaw(renderPage) })
  })

  watch(locationState, () => {
    sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
  })

  const {
    isScrolling,
    arrivedState,
    directions
  } = useScroll(document)

  watchEffect(() => {
    controlState.scroll = scrollY.value
  })

  const currentComponent = (target: Node) => {
    function doFind (model: Component): Component | null {
      let element = document.getElementById(model.id)
      if (element?.contains(target)) {
        for (let child of model.children) {
          let res = doFind(child)
          if (res) {
            return res
          }
        }
        return model
      }
      return null
    }

    // 先搜索模态框
    for (let component of [...renderPage.models, ...renderPage.components]) {
      let targetComponent = doFind(component)
      if (targetComponent) {
        let rect = eval(targetComponent.getElement)(targetComponent.id)?.getBoundingClientRect()
        let location = {
          height: rect?.height,
          left: rect?.left,
          top: rect?.top,
          width: rect?.width
        }
        return {
          id: targetComponent.id,
          location: location
        }
      }
    }
  }

  const currentHoverComponent = (target: Node) => {
    function doFind (model: Component): Component | null {
      let element = document.getElementById(model.id)
      if (element?.contains(target)) {
        for (let child of model.children) {
          let res = doFind(child)
          if (res) {
            return res
          }
        }
        return model
      }
      return null
    }

    // 先搜索模态框
    for (let component of [...renderPage.models, ...renderPage.components]) {
      let targetComponent = doFind(component)
      if (targetComponent && targetComponent.id !== locationState.currentHoverComponent?.id) {
        let rect = eval(targetComponent.getElement)(targetComponent.id)?.getBoundingClientRect()
        let location = {
          height: rect?.height,
          left: rect?.left,
          top: rect?.top,
          width: rect?.width
        }
        locationState.currentHoverComponent = {
          id: targetComponent.id,
          location: location
        }
      }
    }
  }

  const componentMap = computed(() => {
    let models = renderPage.models
    let components = renderPage.components
    let map = new Map()

    function doBuild (component: Component, level: number = 0) {
      component.level = level
      map.set(component.id, component)
      component.children?.forEach(child => {
        child.pid = component.id
        doBuild(child, level + 1)
      })
    }

    for (let component of [...components, ...models]) {
      doBuild(component, 0)
    }
    console.log('componentMap', componentMap)
    return map
  })

  const locationMap = reactive(new Map())

  function currentComponentFromArea (x: number, y: number) {
    function doFind (e: Component): { id: string, location: Location | null } | null {
      let {
        left,
        top,
        width,
        height
      } = locationMap.get(e)

      if (x >= left && x <= left + width && y >= top && y <= top + height) {
        for (let child of e.children) {
          let res = doFind(child)
          if (res) {
            return res
          }
        }
        return {
          id: e.id,
          location: {
            left,
            top,
            width,
            height
          }
        }
      }
      return null
    }

    for (let component of [...renderPage.models, ...renderPage.components]) {
      let targetComponent = doFind(component)
      if (targetComponent) {
        return targetComponent
      }
    }
  }

  function updateLocation () {
    function doGetLocation (component: Component) {
      let rect = eval(component.getElement)(component.id)?.getBoundingClientRect()
      let location: Location = {
        height: rect?.height,
        left: rect?.left,
        top: rect?.top,
        width: rect?.width
      }
      for (let child of component.children) {
        doGetLocation(child)
      }
      locationMap.set(component, location)
    }

    for (let component of [...renderPage.components, ...renderPage.models]) {
      doGetLocation(component)
    }
  }

  const { pressed } = useMousePressed()

  function onDragStart (e: Node) {
    console.log('拖拽节点', locationMap, x.value, y.value)
    locationState.currentPressComponent = currentComponent(e)
  }

  const fetchDirection = (x: number, y: number) => {
    let location = locationState.currentHoverComponent?.location
    if (!location || !location.width) {
      return
    }

    let {
      width,
      height,
      left,
      top
    } = location

    let halfWidth = width / 5
    let halfHeight = height / 5

    let left_ = x - left
    let right_ = left + width - x
    let top_ = y - top
    let bottom_ = top + height - y

    // 离那边最近
    if (left_ <= halfWidth) {
      if (top_ <= halfHeight) {
        return (left / halfWidth < top_ / halfHeight) ? 'left' : 'top'
      }

      if (bottom_ <= halfHeight) {
        return (left / halfWidth < bottom_ / halfHeight) ? 'left' : 'bottom'
      }
      return 'left'
    }

    if (right_ <= halfWidth) {
      if (top_ <= halfHeight) {
        return (right_ / halfWidth < top_ / halfHeight) ? 'right' : 'top'
      }

      if (bottom_ <= halfHeight) {
        return (right_ / halfWidth < bottom_ / halfHeight) ? 'right' : 'bottom'
      }
      return 'right'
    }

    if (top_ <= halfHeight) {
      if (left_ <= halfWidth) {
        return (left_ / halfWidth < top_ / halfHeight) ? 'left' : 'top'
      }

      if (right_ <= halfWidth) {
        return (right_ / halfWidth < top_ / halfHeight) ? 'right' : 'top'
      }
      return 'top'
    }

    if (bottom_ <= halfHeight) {
      if (left_ <= halfWidth) {
        return (left_ / halfWidth < bottom_ / halfHeight) ? 'left' : 'bottom'
      }

      if (right_ <= halfWidth) {
        return (right_ / halfWidth < bottom_ / halfHeight) ? 'right' : 'bottom'
      }
      return 'bottom'
    }
    return 'center'
  }

  function onDragging () {
    // 获取方向
    controlState.direction = fetchDirection(x.value, y.value - controlState.scroll)

    // 如果鼠标已经靠近了上下边缘
    scrollToTop()
  }

  function onDragEnd () {

  }

  const scrollToTop = () => {
    let hScrollTop = window.scrollY
    let hScrollHeight = window.innerHeight

    // 如果
    if (y.value <= hScrollTop) {
      window.scrollTo({ top: hScrollTop - 1 / 2 * (hScrollTop - y.value) })
    } else if (y.value >= hScrollTop + hScrollHeight) {
      window.scrollTo({ top: hScrollTop + 1 / 2 * (y.value - (hScrollTop + hScrollHeight)) })
    }

    // window.scrollTo({ top: 2000 })
    // console.log(hScrollTop, hScrollHeight, y.value)
  }

  onLongPress(document.documentElement, () => {
    console.log('长按')
    controlState.isLongPress = true
  }, { delay: 200 })

  onMounted(() => {
    window.addEventListener('scroll', () => {
      updateLocation()
      locationState.currentHoverComponent = currentComponentFromArea(x.value, y.value)
      if (locationState.currentClickComponent) {
        locationState.currentClickComponent.location = locationMap.get(componentMap.value.get(locationState.currentClickComponent.id))
      }
      if (locationState.currentPressComponent) {
        locationState.currentPressComponent.location = locationMap.get(componentMap.value.get(locationState.currentPressComponent.id))
      }
      // console.log('收集的位置', locationMap)
    })

    window.addEventListener('mouseup', (event: Event) => {
      locationState.currentClickComponent = currentComponent(<Node>event.target)
    }, { passive: true })

    window.addEventListener('mousemove', (event: MouseEvent) => {
      locationState.currentHoverComponent = currentComponent(<Node>event.target)
    }, { passive: true })

    window.addEventListener('focusin', () => {
      console.log('获取焦点')
    }, { passive: true })

    window.addEventListener('focusout', () => {
      console.log('失去焦点')
    }, { passive: true })

    window.addEventListener('mousemove', (event: MouseEvent) => {
      controlState.x = event.clientX
      controlState.y = event.clientY
      if (controlState.isLongPress) {
        if (!controlState.isDrag) {
          controlState.isDrag = true
          onDragStart(<Node>event.target)
        } else {
          console.log(event)
          onDragging()

        }
      }
      sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
    }, { passive: true })

    window.addEventListener('mouseup', () => {
      controlState.isLongPress = false
      if (controlState.isDrag) {
        controlState.isDrag = false
        onDragEnd()
      }

      sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
    }, { passive: true })

    window.addEventListener('mouseleave', (e: Event) => {
      console.log('鼠标移出', e.target)
      controlState.isLongPress = false
    }, { passive: true })

    // 全局静止选择文字
    document.onselectstart = () => false
  })

  return {
    renderPage,
    componentMap,
    currentHoverComponent,
    locationState,
    locationMap,
    controlState,
    pressed,
    isScrolling,
    arrivedState,
    directions
  }
}

export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';

export interface Component {
  id: string,
  pid?: string,
  level?: number,
  name: string,
  type: string,
  children: Component[],
  supportDirection: Direction[]
  slots: any[],
  visible: boolean,
  getElement: string
}

abstract class BaseComponent implements Component {
  id: string = v4()
  name: string = ''
  abstract type: string
  children: Component[] = []
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  slots = []
  visible = true
  getElement = ((id: string) => {
    return document.getElementById(id)
  }).toString()
}

class Card extends BaseComponent {
  type = 'CardComponent'

  constructor (name: string = '卡片') {
    super()
    this.name = name
  }
}

class Page extends BaseComponent {
  type = 'PageContainer'

  constructor (name: string = '页面') {
    super()
    this.name = name
  }
}

class Dialog extends BaseComponent {
  type = 'DialogComponent'
  visible = true
  getElement = ((id: string) => {
    return document.getElementById(id)?.firstElementChild?.firstElementChild?.firstElementChild
  }).toString()

  constructor (name: string = '对话框') {
    super()
    this.name = name
  }
}

export class LocationState {
  currentHoverComponent?: { id: string, location: Location | null }
  currentClickComponent?: { id: string, location: Location | null }
  currentPressComponent?: { id: string, location: Location | null }
}

export class RenderPage {
  components: Component[] = []
  models: Component[] = []
}

export class ControlState {
  isLongPress: boolean = false
  isDrag: boolean = false
  x: number = 0
  y: number = 0
  scroll: number = 0
  direction?: Direction
}
