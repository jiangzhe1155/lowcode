import {
  Card,
  Component, ComponentGroup,
  ComponentType,
  Dialog,
  Direction,
  Location,
  LocationState,
  Page,
  Root
} from '@/views/lowCode/service'
import { computed, reactive, ref } from 'vue'
import { v4 } from 'uuid'

export const iframeRef = ref<any>()
export const iframeWin = () => {
  return iframeRef.value?.contentWindow
}
export const iframeDoc = () => {
  return iframeRef.value?.contentWindow.document
}

let page = new Page()
let card = new Card('卡片1')
card.children.push(new Card('卡片2'))
page.children.push(new Card('卡片3'), card, new Card('卡片4'))
let dialog = new Dialog()
dialog.children.push(new Card('卡片6'))
let root = new Root()
root.children.push(page, new Card('卡片7'))

export class RenderPage {
  component: Component = new Root()
  models: Component[] = []
}

let res = new RenderPage()
res.models = [dialog]
res.component = root

export const renderPage: RenderPage = reactive(res)
export const componentMap = computed(() => {
  console.log('componentMap 更新', renderPage)
  let map = new Map()

  function doBuild (component: Component, level: number = 0) {
    component.level = level
    map.set(component.id, component)
    component.children?.forEach(child => {
      child.pid = component.id
      doBuild(child, level + 1)
    })
  }

  for (let component of [...renderPage.models, renderPage.component]) {
    doBuild(component, 0)
  }

  return map
})
export const locationState: LocationState = reactive(new LocationState())
export const x = ref()
export const y = ref()
export const locationMap = reactive(new Map())
export const startDrag = ref(false)
export const isDragging = ref(false)
export const asideComponentType = ref()
export const asideComponentGroup = ref()
export const isAffixPanel = ref(false)
export const isPanelOpen = ref(false)

export const isInside = () => {
  let rect = document.getElementById('iframe-holder')?.getBoundingClientRect()
  if (!rect) {
    return false
  }
  let {
    left,
    width,
  } = rect
  return x.value >= left && x.value <= left + width
}

export const currentComponent = (target: Node) => {
  let doc = iframeDoc()

  function doFind (model: Component): Component | null {
    let element = doc.getElementById(model.id)
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
  for (let component of [...renderPage.models, renderPage.component]) {
    let targetComponent = doFind(component)
    if (targetComponent) {
      let rect = eval(targetComponent.getElement)(targetComponent.id, doc)?.getBoundingClientRect()
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

export function currentComponentFromArea (x: number, y: number) {
  function doFind (e: Component): { id: string, location: Location | null } | null {
    let location = undefined
    if (locationMap.has(e.id)) {
      location = locationMap.get(e)
    } else {
      let rect = eval(e.getElement)(e.id, iframeDoc())?.getBoundingClientRect()
      location = {
        height: rect?.height,
        left: rect?.left,
        top: rect?.top,
        width: rect?.width
      }
      // locationMap.set(e.id, location)
    }

    if (!location) {
      return null
    }

    let {
      left,
      top,
      width,
      height
    } = location

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

  for (let component of [...renderPage.models, renderPage.component]) {
    let targetComponent = doFind(component)
    if (targetComponent) {
      return targetComponent
    }
  }

}

export const fetchDirection = (x: number, y: number) => {
  let location = locationState.currentInsertionComponent?.location
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

export const fetchLocation = (componentId: string) => {
  let component = componentMap.value.get(componentId)
  let rect = eval(component.getElement)(component.id, iframeDoc())?.getBoundingClientRect()
  if (rect) {
    let location = {
      height: rect?.height,
      left: rect?.left,
      top: rect?.top,
      width: rect?.width
    }
    return {
      id: component.id,
      location: location
    }
  }
}

export function move (pressId: string, hoverId: string, direction: Direction) {
  let map = componentMap.value
  let component = map.get(pressId)

  //如果是对话框,不移动
  if (component.group === 'Model') {
    return pressId
  }

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

export const copy = (componentId: string) => {
  console.log('复制', componentId)
  let element = componentMap.value.get(componentId)

  function doCopy (element: Component) {
    let target = Object.assign({}, element)
    target.id = v4()
    target.children = target.children.map(e => doCopy(e))
    return target
  }

  let res = doCopy(element)
  res = JSON.parse(JSON.stringify(res))

  // 如果是对话框，复制到最后
  if (element.group === 'Model') {
    renderPage.models.push(res)
    return res.id
  }

  let pElement = componentMap.value.get(element.pid)
  let i = pElement.children.indexOf(element)
  if (i + 1 >= pElement.children.length) {
    pElement.children.push(res)
  } else {
    pElement.children.splice(i + 1, 0, res)
  }
  return res.id
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

export function add (pressTypeId: ComponentType, pressGroup: ComponentGroup, targetId: string, dragDirection: string) {
  let newInstance = <Component>newInstanceByType(pressTypeId)
  let cMap = componentMap.value
  let targetComponent = cMap.get(targetId)

  //如果是对话框默认加入到对话框的列表
  if (newInstance.group === 'Model') {
    renderPage.models.push(newInstance)
    return newInstance.id
  }

  if (dragDirection === 'center') {
    targetComponent.children.push(newInstance)
    newInstance.level = targetComponent.level + 1
    newInstance.pid = targetComponent.id
  } else {
    let newParentElement = cMap.get(targetComponent.pid)
    newInstance.level = newParentElement.level + 1
    newInstance.pid = newParentElement.id

    let j = newParentElement.children.indexOf(targetComponent)
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

export const deleteComponent = (componentId: string) => {
  let component = componentMap.value.get(componentId)

  //如果是对话框默认加入到对话框的列表
  if (component.group === 'Model') {
    let i = renderPage.models.indexOf(component)
    renderPage.models.splice(i, 1)
    return
  }

  if (component.level == 0) {
    console.log('无法删除根节点')
    return
  }
  let pElement = componentMap.value.get(component.pid)
  let i = pElement.children.indexOf(component)
  pElement.children.splice(i, 1)
}

const isSubElement = (pressNodeId: string | undefined, dragElementId: string | undefined) => {
  if (pressNodeId === dragElementId) {
    return true
  }
  let element = componentMap.value.get(pressNodeId)
  if (element && element.children) {
    for (let child of element.children) {
      if (isSubElement(child.id, dragElementId)) {
        return true
      }
    }
  }
  return false
}

function getTopComponent (pressId: string | undefined): Component {
  let res = componentMap.value.get(pressId)
  if (res.level > 0) {
    return getTopComponent(res.pid)
  }
  return res
}

export const isShowInsertion = computed(() => {
  let pressId = locationState.currentPressComponent?.id
  let hoverId = locationState.currentInsertionComponent?.id
  let cMap = componentMap.value
  let pressGroup = pressId ? cMap.get(pressId).group : asideComponentGroup.value
  if (!isDragging.value || !hoverId) {
    return false
  }

  // 如果是子元素 不允許
  if (!asideComponentType.value && isSubElement(pressId, hoverId)) {
    return false
  }

  // 不允许从对话框移到容器中
  if (pressId && getTopComponent(pressId).group !== getTopComponent(hoverId).group) {
    return false
  }

  if (pressGroup) {
    // 存在对话框的情况下，不能移动到容器中
    for (let model of renderPage.models) {
      if (model.visible && getTopComponent(hoverId).id !== model.id) {
        return false
      }
    }
  }

  if (locationState.direction === 'center') {
    // 如果这个容器已经存在子元素时 或者不支持這個分類
    let e = cMap.get(hoverId)
    if (!e || e.children.length > 0 || e.supportDirection.indexOf('center') < 0 || e.supportGroup.indexOf(pressGroup) < 0) {
      return false
    } else {
      return true
    }
  }

  // 这个组件的父组件支持这个方向的操作
  let pElement = cMap.get(cMap.get(hoverId)?.pid)
  if (!pElement) {
    return false
  }

  if (pElement.supportDirection.indexOf(<Direction>locationState.direction) < 0 || pElement.supportGroup.indexOf(pressGroup) < 0) {
    return false
  }

  return true
})

export const scrollToTopOrBottom = () => {
  let win = iframeWin()
  let hScrollTop = win.scrollY
  let hScrollHeight = win.innerHeight
  // console.log('hScrollTop', hScrollTop, 'hScrollHeight', hScrollHeight)
  if (y.value <= hScrollTop + 20) {
    0
    win.scrollTo({ top: hScrollTop - 1 / 2 * (hScrollTop + 20 - y.value) })
  } else if (y.value >= hScrollTop + hScrollHeight - 20) {
    win.scrollTo({ top: hScrollTop + 1 / 2 * (y.value - (hScrollTop + hScrollHeight - 20)) })
  }
}
