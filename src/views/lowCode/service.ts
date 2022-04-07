import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import { v4 } from 'uuid'

export function useRenderPageData (pageId: string) {
  // 构造假数据
  let page = new Page()
  let card = new Card()
  card.children.push(new Card())
  page.children.push(new Card(), card, new Card())
  const data: { components: Component[], models: Component[] } = {
    components: [page, new Card()],
    models: [new Dialog()]
  }

  sessionStorage.removeItem(pageId)
  const renderPage = useStorage(pageId, data, sessionStorage)
  const componentMap = computed(() => {
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
  // const add = (pressTypeId: string, dragElementId: string, dragDirection: string) => {
  //   console.log('添加')
  //   let element = {
  //     id: v4(),
  //     name: '卡片',
  //     level: 0,
  //     pid: '',
  //     type: 'CardComponent',
  //     isContainer: false,
  //     children: [],
  //     slots: [],
  //     visible: true,
  //     supportDirection: ['top', 'bottom', 'center']
  //   }
  //
  //   let dragElement = elementMap.get(dragElementId)
  //   if (dragDirection === 'center') {
  //     dragElement.children.push(element)
  //     element.level = dragElement.level + 1
  //     element.pid = dragElement.id
  //   } else {
  //     let newParentElement = elementMap.get(dragElement.pid)
  //     element.level = newParentElement.level + 1
  //     element.pid = newParentElement.id
  //
  //     let j = newParentElement.children.indexOf(dragElement)
  //     let shift = 0
  //     if (dragDirection === 'bottom' || dragDirection === 'right') {
  //       shift = 1
  //     }
  //     if (j + shift >= newParentElement.children.length) {
  //       newParentElement.children.push(element)
  //     } else {
  //       newParentElement.children.splice(j + shift, 0, element)
  //     }
  //   }
  //   return element.id
  // }
  return {
    renderPage,
    componentMap
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
  visible: boolean
}

abstract class BaseComponent implements Component {
  id: string = v4()
  abstract name: string
  abstract type: string
  children: Component[] = []
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  slots = []
  visible = true
}

class Card extends BaseComponent {
  type = 'CardComponent'
  name = '卡片'
}

class Page extends BaseComponent {
  type = 'PageContainer'
  name = '页面'
}

class Dialog extends BaseComponent {
  type = 'DialogComponent'
  name = '对话框'
  visible = false
}
