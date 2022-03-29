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

export const canHover = (elementId: string) => {
  if (isClick(elementId)) {
    // 已经被点击
    return false
  }
  // 1 没被点击
  // 2 存在被点击，但是层级在这个之上
  if (!isMouseInArea()) {
    return true
  }

  let clickElement = nodeState.elementMap[nodeState.clickedNodeId]
  let next = nodeState.elementMap[elementId]
  if (next.level > clickElement.level) {
    return true
  }
  return false
}
