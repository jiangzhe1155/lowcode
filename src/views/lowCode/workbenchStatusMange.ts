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
  renderPage: {
    root: {
      id: '1',
      name: '页面',
      type: 'RootContainer',
      slots: [],
      children: [
        {
          id: '2',
          name: '通用容器',
          type: 'PageContainer',
          slots: [],
          children: [
            {
              id: '1',
              name: '卡片',
              type: 'CardComponent',
              slots: [],
            }
          ]
        }
      ]
    },
    modelBoxes: []
  },
  elementMap: {
    '1': {
      level: 1
    },
    '2': {
      level: 2
    },
    '3': {
      level: 3
    }
  }
})

export const {
  x,
  y,
  sourceType
} = useMouse()

export const isMouseInArea = () => {
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

export const nodeStateOnClick = (elementId: string, localtion: any) => {
  nodeState.clickedNodeId = elementId
  nodeState.clickedLocation = localtion
  console.log(localtion)
}

export function isClick (elementId: string) {
  return nodeState.clickedNodeId === elementId
}

export function compareLevel (elementId: string, clickedNodeId: string): number {
  let pre = nodeState.elementMap[elementId]
  let next = nodeState.elementMap[clickedNodeId]
  return pre.level - next.level
}

export const canHover = (elementId: string) => {
  if (isClick(elementId)) {
    // 已经被点击
    return false
  }

  // 2 存在被点击，但是层级在这个之上
  if (isMouseInArea() && compareLevel(elementId, nodeState.clickedNodeId) < 0) {
    return false
  }

  return true
}
