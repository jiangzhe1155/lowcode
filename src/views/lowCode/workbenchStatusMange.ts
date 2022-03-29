import { reactive } from 'vue'
import { useMouse } from '@vueuse/core'

export const nodeState = reactive({
  clickedNodeId: '',
  clickedLocation: {
    top: 0,
    width: 0,
    height: 0,
    left: 0
  },
  hoverNodeId: '',
  hoverItemNodeId: ''
})

export const renderPage = reactive({
  root: {
    id: '1',
    name: '页面',
    type: 'RootContainer',
    slots: [],
    level: 0,
    children: [
      {
        id: '2',
        name: '通用容器',
        type: 'PageContainer',
        slots: [],
        level: 1,
        children: [
          {
            id: '3',
            name: '卡片',
            type: 'CardComponent',
            level: 2,
            slots: [],
          }
        ]
      }
    ]
  },
  modelBoxes: []
})
export const elementMap = reactive(new Map())
export const locationMap = reactive(new Map())

const build = (root, level: number):void => {
  root.level = level
  elementMap.set(root.id, root)
  if (root.children && root.children.length > 0) {
    for (let child of root.children) {
      build(child, level + 1)
    }
  }
}

const buildElementMap = () => {
  let root = renderPage.root
  build(root, 0)
}

buildElementMap()

export const {
  x,
  y,
  sourceType
} = useMouse()

export const isMouseInClickArea = () => {
  if (nodeState.clickedNodeId.length > 0) {
    let {
      top,
      width,
      height,
      left
    } = nodeState.clickedLocation
    return y.value >= top && (y.value <= top + height) && (x.value >= left) && (x.value <= left + width)
  }
  return false
}

export const nodeStateOnClick = (elementId: string) => {
  nodeState.clickedNodeId = elementId
  nodeState.clickedLocation = locationMap.get(elementId)
  // 清空 hover 选择
  nodeState.hoverItemNodeId = ''
}

export function isClick (elementId: string) {
  return nodeState.clickedNodeId === elementId
}

export function compareLevel (elementId: string, clickedNodeId: string): number {
  let pre = elementMap.get(elementId)
  let next = elementMap.get(clickedNodeId)
  return pre.level - next.level
}

export const nodeStateOnHover = (elementId: string, isHover: boolean) => {
  if (!isHover) {
    if (elementId === nodeState.hoverNodeId && !isHover) {
      nodeState.hoverNodeId = ''
    }
    return
  }
  nodeState.hoverNodeId = elementId
}

export const nodeStateOnHoverItem = (elementId: string, isHover: boolean) => {
  if (!isHover) {
    if (elementId === nodeState.hoverItemNodeId && !isHover) {
      nodeState.hoverItemNodeId = ''
    }
    return
  }
  nodeState.hoverItemNodeId = elementId
}

export const isShowHover = (elementId: string) => {
  if (isClick(elementId)) {
    return false
  }
  // 并且鼠标不在特定的区块
  return (nodeState.hoverNodeId === elementId && canHover(elementId)) || nodeState.hoverItemNodeId === elementId
}

export const canHover = (elementId: string) => {
  if (isClick(elementId)) {
    // 已经被点击
    return false
  }

  // 2 存在被点击，但是层级在这个之上
  if (isMouseInClickArea() && compareLevel(elementId, nodeState.clickedNodeId) < 0) {
    return false
  }

  return true
}


