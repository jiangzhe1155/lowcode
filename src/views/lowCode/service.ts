import { useSessionStorage, useStorage, useStorageAsync } from '@vueuse/core'
import { computed, watchEffect } from 'vue'
import { v4 } from 'uuid'
import { Location } from '@/views/lowCode/componentLocation'

export function useRenderPageData (pageId: string) {

  // 构造假数据
  let page = new Page()
  let card = new Card('卡片1')
  card.children.push(new Card('卡片2'))
  page.children.push(new Card('卡片3'), card, new Card('卡片4'))
  const data: {
    components: Component[], models: Component[] } = {
    components: [page, new Card('卡片5')],
    models: [new Dialog()]
  }

  sessionStorage.removeItem(pageId)
  const renderPage= useStorage(pageId, data, sessionStorage)
  const locationState= useStorage(pageId+"_locationState", '' , sessionStorage)

  const currentHoverComponent = (target:Node) => {
      function doFind (model: Component):Component | null {
        let element = document.getElementById(model.id);
        if (element?.contains(target)){
          for (let child of model.children) {
            let res = doFind(child);
            if (res){
              return res;
            }
          }
          return model;
        }
        return null;
      }

    // 先搜索模态框
    for (let component of [...data.models, ...data.components]) {
       let targetComponent = doFind(component);
       if (targetComponent && targetComponent.id  !== locationState.value ){
         locationState.value = targetComponent.id
         console.log('找到',targetComponent.name)
       }
    }
  }

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

  return {
    renderPage,
    componentMap,
    currentHoverComponent,
    locationState
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
}

abstract class BaseComponent implements Component {
  id: string = v4()
  name: string
  abstract type: string
  children: Component[] = []
  supportDirection: Direction[] = ['top', 'bottom', 'center']
  slots = []
  visible = true
  fetchLocation:Function = ():Location => {
    let element = document.getElementById(this.id)
    return {
      height: element?.offsetHeight,
      left: element?.offsetLeft,
      top: element?.offsetTop,
      width: element?.offsetWidth
    };
  }
}

class Card extends BaseComponent {
  type = 'CardComponent'
  constructor (name:string = '卡片') {
    super();
    this.name = name;
  }
}

class Page extends BaseComponent {
  type = 'PageContainer'
  constructor (name:string = '页面') {
    super();
    this.name = name;
  }
}

class Dialog extends BaseComponent {
  type = 'DialogComponent'
  visible = true
  fetchLocation = ():Location => {
    let element :Element | null | undefined = document.getElementById(this.id)?.firstElementChild?.firstElementChild?.firstElementChild
    console.log(element)
    return {
      height: element?.offsetHeight,
      left: element?.offsetLeft,
      top: element?.offsetTop,
      width: element?.offsetWidth
    };
  }
  constructor (name:string = '对话框') {
    super();
    this.name = name;
  }
}
