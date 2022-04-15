import { Card, Component, Dialog, LocationState, Page, Root } from '@/views/lowCode/service'
import { computed, reactive, ref, toRaw, watch } from 'vue'
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
root.children.push(page, new Card('卡片7'), dialog)
export const renderPage: Component = reactive(root)
export const componentMap = computed(() => {
  let map = new Map()

  function doBuild (component: Component, level: number = 0) {
    component.level = level
    map.set(component.id, component)
    component.children?.forEach(child => {
      child.pid = component.id
      doBuild(child, level + 1)
    })
  }

  doBuild(renderPage, 0)
  return map
})
export const locationState: LocationState = reactive(new LocationState())
export const x = ref()
export const y = ref()

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
  let targetComponent = doFind(renderPage)
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
  let pElement = componentMap.value.get(element.pid)
  let i = pElement.children.indexOf(element)
  if (i + 1 >= pElement.children.length) {
    pElement.children.push(res)
  } else {
    pElement.children.splice(i + 1, 0, res)
  }
  return res.id
}

export const deleteComponent = (componentId: string) => {
  let element = componentMap.value.get(componentId)
  if (element.level == 0) {
    console.log('无法删除根节点')
    return
  }
  let pElement = componentMap.value.get(element.pid)
  let i = pElement.children.indexOf(element)
  pElement.children.splice(i, 1)
  console.log('删除dialog', renderPage)
}
