import { Card, Component, Dialog, Page, Root } from '@/views/lowCode/service'
import { computed, reactive } from 'vue'

export const config: {
  iframeWin: Window,
  iframeDoc: Document
}= reactive({})

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

export const currentComponent = (target: Node) => {
  function doFind (model: Component): Component | null {
    let element = config.iframeDoc.getElementById(model.id)
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
    let rect = eval(targetComponent.getElement)(targetComponent.id, config.iframeDoc)?.getBoundingClientRect()
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

