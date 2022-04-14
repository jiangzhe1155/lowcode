import { Card, Component, Dialog, LocationState, Page, Root } from '@/views/lowCode/service'
import { computed, reactive, ref } from 'vue'
import { isInside } from '@/views/lowCode/state'

export const iframeRef = ref<HTMLElement>()
export const iframeWin = () => {
  return iframeRef.value?.contentWindow
}
export const iframeDoc = () => {
  return iframeRef.value?.contentWindow.document
}

const isInside = ref(false)

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

export const currentComponent = (target: Node) => {
  let doc = iframeDoc()

  function doFind (model: Component): Component | null {
    let element = doc.getElementById(model.id)
    // console.log('element', doc, element)
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



