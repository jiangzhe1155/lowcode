import { computed, nextTick, onMounted, reactive, toRaw, watch, watchEffect } from 'vue'
import { v4 } from 'uuid'
import { addMessageListener, sendIframeMessage } from '@/views/lowCode/iframeUtil'
import { onLongPress, useEventListener, useMouse, useScroll } from '@vueuse/core'

export function useRenderPageData (pageId?: string) {
  let page = new Page()
  let card = new Card('卡片1')
  card.children.push(new Card('卡片2'))
  page.children.push(new Card('卡片3'), card, new Card('卡片4'))
  let dialog = new Dialog()
  dialog.children.push(new Card('卡片6'))
  let root = new Root()
  root.children.push(page, new Card('卡片7'), dialog)
  const renderPage: Component = reactive(root)

  const {
    x,
    y
  } = useMouse()

  const { y: scrollY } = useScroll(window)
  const componentMap = new Map()
  const locationState: LocationState = reactive(new LocationState())
  const controlState = reactive<ControlState>(new ControlState())

  watch(locationState, () => {
    sendIframeMessage(window.parent, 'locationStateChange', { locationState: toRaw(locationState) })
  })

  watch(renderPage, () => {
    sendIframeMessage(window.parent, 'renderPageUpdate', { renderPage: toRaw(renderPage) })
  }, { immediate: true })

  watch(locationState, () => {
    sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
  })

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
    let targetComponent = doFind(renderPage)
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

  function updateComponentMap (renderPage: Component) {
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

  watch(renderPage, (n) => {
    updateComponentMap(n)
  }, {
    immediate: true
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

    let targetComponent = doFind(renderPage)
    if (targetComponent) {
      return targetComponent
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

    doGetLocation(renderPage)

    if (locationState.currentClickComponent) {
      locationState.currentClickComponent.location = locationMap.get(componentMap.get(locationState.currentClickComponent.id))
    }
    if (locationState.currentPressComponent) {
      locationState.currentPressComponent.location = locationMap.get(componentMap.get(locationState.currentPressComponent.id))
    }
    if (locationState.currentHoverComponent) {
      locationState.currentHoverComponent.location = locationMap.get(componentMap.get(locationState.currentHoverComponent.id))
    }
  }

  const onDelete = (componentId: string) => {
    let element = componentMap.get(componentId)
    if (element.level == 0) {
      console.log('无法删除根节点')
      return
    }
    let pElement = componentMap.get(element.pid)
    let i = pElement.children.indexOf(element)
    pElement.children.splice(i, 1)
    console.log('删除dialog', renderPage)
  }

  function add (pressTypeId: ComponentType, pressGroup: ComponentGroup, hoverId: string, dragDirection: string) {
    let newInstance = <Component>newInstanceByType(pressTypeId)

    let dragElement = componentMap.get(hoverId)
    if (dragDirection === 'center') {
      dragElement.children.push(newInstance)
      newInstance.level = dragElement.level + 1
      newInstance.pid = dragElement.id
    } else {
      let newParentElement = componentMap.get(dragElement.pid)
      newInstance.level = newParentElement.level + 1
      newInstance.pid = newParentElement.id

      let j = newParentElement.children.indexOf(dragElement)
      let shift = 0
      if (dragDirection === 'bottom' || dragDirection === 'right') {
        shift = 1
      }
      if (j + shift >= newParentElement.children.length) {
        newParentElement.children.push(newInstance)
      } else {
        newParentElement.children.splice(j + shift, 0, newInstance)
      }
    }
    console.log('添加成功')
    return newInstance.id
  }

  const onCopy = (componentId: string) => {
    console.log('复制', componentId)
    let element = componentMap.get(componentId)

    function doCopy (element: Component) {
      let target = Object.assign({}, element)
      target.id = v4()
      target.children = target.children.map(e => doCopy(e))
      return target
    }

    let res = doCopy(element)
    res = JSON.parse(JSON.stringify(res))
    let pElement = componentMap.get(element.pid)
    let i = pElement.children.indexOf(element)
    if (i + 1 >= pElement.children.length) {
      pElement.children.push(res)
    } else {
      pElement.children.splice(i + 1, 0, res)
    }
    return res.id
  }

  function move (pressId: string, hoverId: string, direction: Direction) {
    let map = componentMap
    let component = map.get(pressId)

    let pChildren = map.get(component.pid).children
    let i = pChildren.indexOf(component)
    pChildren.splice(i, 1)

    let dragElement = map.get(hoverId)
    if (direction === 'center') {
      map.get(hoverId).children.push(component)
      component.level = dragElement.level + 1
      component.pid = dragElement.id
    } else {
      let newParentElement = map.get(dragElement.pid)
      if (newParentElement) {
        component.level = newParentElement.level + 1
        component.pid = newParentElement.id
      }

      let newParentChildren = map.get(dragElement.pid).children
      let j = newParentChildren.indexOf(dragElement)
      let shift = 0
      if (direction === 'bottom' || direction === 'right') {
        shift = 1
      }
      if (j + shift >= newParentChildren.length) {
        newParentChildren.push(component)
      } else {
        newParentChildren.splice(j + shift, 0, component)
      }
    }

    return pressId
  }

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

    // 如果鼠标已经靠近了上下边缘,自动滚动
    scrollToTopOrBottom()
  }

  function onDragEnd () {
    if (locationState.currentHoverComponent && isShowInsertion.value && controlState.direction) {
      let clickId: string = ''
      if (controlState.asideComponentType && controlState.asideComponentGroup) {
        clickId = add(controlState.asideComponentType, controlState.asideComponentGroup, locationState.currentHoverComponent?.id, controlState.direction)
        sendIframeMessage(window.parent, 'onDragEnd', {})
      } else if (locationState.currentPressComponent) {
        clickId = move(locationState.currentPressComponent?.id, locationState.currentHoverComponent?.id, controlState.direction)
      }

      setTimeout(() => {
        updateLocation()
        locationState.currentClickComponent = {
          id: clickId,
          location: toRaw(locationMap.get(componentMap.get(clickId)))
        }
      }, 300)
    }
  }

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

  const isShowInsertion = computed(() => {
    let pressId = locationState.currentPressComponent?.id
    let hoverId = locationState.currentHoverComponent?.id
    let pressGroup = pressId ? componentMap.get(pressId).group : controlState.asideComponentGroup
    if (!controlState.isDrag || !hoverId) {
      return false
    }

    console.log(pressGroup)

    // 如果是子元素 不允許
    if (pressId && isSubElement(pressId, hoverId)) {
      return false
    }

    if (controlState.direction === 'center') {
      // 如果这个容器已经存在子元素时
      let e = componentMap.get(hoverId)
      if (!e || e.children.length > 0 || e.supportDirection.indexOf('center') < 0 || e.supportGroup.indexOf(pressGroup) < 0) {
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

    if (pElement.supportDirection.indexOf(<Direction>controlState.direction) < 0 || pElement.supportGroup.indexOf(pressGroup) < 0) {
      return false
    }
    return true
  })

  const scrollToTopOrBottom = () => {
    let hScrollTop = window.scrollY
    let hScrollHeight = window.innerHeight

    if (y.value <= hScrollTop + 20) {0
      window.scrollTo({ top: hScrollTop - 1 / 2 * (hScrollTop + 20 - y.value) })
    } else if (y.value >= hScrollTop + hScrollHeight - 20) {
      window.scrollTo({ top: hScrollTop + 1 / 2 * (y.value - (hScrollTop + hScrollHeight - 20)) })
    }
  }

  onLongPress(document.documentElement, () => {
    console.log('长按')
    controlState.isLongPress = true
  }, { delay: 200 })

  useEventListener('scroll', () => {
    updateLocation()
    locationState.currentHoverComponent = currentComponentFromArea(x.value, y.value)
  })

  useEventListener('mouseup', (event: Event) => {
    locationState.currentClickComponent = currentComponent(<Node>event.target)
  }, true)

  useEventListener('click', (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    // locationState.currentClickComponent = currentComponent(<Node>event.target)
  }, true)

  useEventListener('mousemove', (event: MouseEvent) => {
    locationState.currentHoverComponent = currentComponent(<Node>event.target)
  })

  useEventListener('mouseleave', (event: MouseEvent) => {
    console.log('鼠标移出', event)
  }, false)

  useEventListener('mousemove', (event: MouseEvent) => {
    console.log('移动中')
      controlState.x = event.clientX
      controlState.y = event.clientY
      if (controlState.isLongPress) {
        if (!controlState.isDrag) {
          controlState.isDrag = true
          if (!controlState.asideComponentType) {
            onDragStart(<Node>event.target)
          }
        } else {
          onDragging()
        }
      }
      sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
    }, { passive: true }
  )

  useEventListener('mouseup', () => {
    controlState.isLongPress = false
    if (controlState.isDrag) {
      onDragEnd()
      controlState.isDrag = false
      controlState.asideComponentType = undefined
      controlState.asideComponentGroup = undefined
    }
    sendIframeMessage(window.parent, 'controlStateUpdate', { controlState: toRaw(controlState) })
  }, { passive: true })

  useEventListener('resize', () => {
    updateLocation()
  }, { passive: true })

  addMessageListener('componentCopy', (payload: any) => {
    let clickId = onCopy(payload.id)
    setTimeout(() => {
      updateLocation()
      locationState.currentClickComponent = {
        id: clickId,
        location: toRaw(locationMap.get(componentMap.get(clickId)))
      }
    }, 300)
  })

  addMessageListener('componentDelete', (payload: any) => {
    onDelete(payload.id)
    nextTick(() => {
      updateLocation()
      locationState.currentClickComponent = undefined
    })
  })

  addMessageListener('onStartDrag', (payload: any) => {
    controlState.asideComponentType = payload.componentType
    controlState.asideComponentGroup = payload.componentGroup
    controlState.isLongPress = true
  })

  addMessageListener('onDragEnd', () => {
    console.log('结束了')
    controlState.isLongPress = false
    controlState.isDrag = false
    controlState.direction = undefined
    controlState.asideComponentType = undefined
    controlState.asideComponentGroup = undefined
  })

  addMessageListener('onHoverComponent', (payload: any) => {
    if (locationMap.size == 0) {
      updateLocation()
    }

    locationState.currentHoverComponent = {
      id: payload.id,
      location: toRaw(locationMap.get(componentMap.get(payload.id)))
    }
  })

  addMessageListener('onClickComponent', (payload: any) => {
    if (locationMap.size == 0) {
      updateLocation()
    }

    locationState.currentClickComponent = {
      id: payload.id,
      location: toRaw(locationMap.get(componentMap.get(payload.id)))
    }
  })

  onMounted(() => {
    // 全局禁止选择文字
    document.onselectstart = () => false
  })

  return {
    renderPage,
    componentMap,
    locationState,
    locationMap,
    controlState,
  }
}

export type Direction = 'top' | 'bottom' | 'center' | 'left' | 'right';

export interface Component {
  id: string,
  pid?: string,
  level?: number,
  name: string,
  type: ComponentType,
  children: Component[],
  supportDirection: Direction[]
  slots: any[],
  visible: boolean,
  getElement: string,
  group: ComponentGroup,
  supportGroup: ComponentGroup[]
}

const newInstanceByType = (type: ComponentType): Component | undefined => {
  if (type === 'CardComponent') {
    return new Card()
  } else if (type === 'RootContainer') {
    return new Root()
  } else if (type === 'PageContainer') {
    return new Page()
  } else if (type === 'DialogComponent') {
    return new Dialog()
  }
}

export type ComponentType = 'CardComponent' | 'RootContainer' | 'PageContainer' | 'DialogComponent';
export type ComponentGroup = 'Input' | 'Container' | 'Model';

export abstract class BaseComponent implements Component {
  id: string = v4()
  pid: string = ''
  name: string = ''
  level?: number
  abstract type: ComponentType
  children: Component[] = []
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  slots = []
  visible = true
  getElement = ((id: string) => {
    return document.getElementById(id)
  }).toString()
  abstract group: ComponentGroup
  supportGroup: ComponentGroup[] = []
}

export class Card extends BaseComponent {
  type: ComponentType = 'CardComponent'
  group: ComponentGroup = 'Container'
  supportGroup: ComponentGroup[] = ['Input', 'Container']

  constructor (name: string = '卡片') {
    super()
    this.name = name
  }
}

export class Root extends BaseComponent {
  type: ComponentType = 'RootContainer'
  group: ComponentGroup = 'Container'
  supportGroup: ComponentGroup[] = ['Container', 'Model']

  constructor (name: string = '根节点') {
    super()
    this.name = name
  }
}

export class Page extends BaseComponent {
  type: ComponentType = 'PageContainer'
  group: ComponentGroup = 'Container'
  supportGroup: ComponentGroup[] = ['Container', 'Input']

  constructor (name: string = '页面') {
    super()
    this.name = name
  }
}

export class Dialog extends BaseComponent {
  type: ComponentType = 'DialogComponent'
  group: ComponentGroup = 'Model'
  supportGroup: ComponentGroup[] = ['Container', 'Input']
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
  asideComponentType: ComponentType | undefined
  asideComponentGroup: ComponentGroup | undefined
}

export class Location {
  left: number = 0
  top: number = 0
  height: number = 0
  width: number = 0
}
