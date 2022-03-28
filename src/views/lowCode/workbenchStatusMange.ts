import { computed, reactive } from 'vue'
import { useMouse } from '@vueuse/core'

export const nodeState = reactive({
  clickedNodeId: '',
  clickedLocation: {
    top: 0,
    width: 0,
    height: 0,
    left: 0
  }
})
export const {
  x,
  y,
  sourceType
} = useMouse()

export const nodeStateOnClick = (elementId: string, localtion: any) => {
  nodeState.clickedNodeId = elementId
  nodeState.clickedLocation = localtion
  console.log(localtion)
}

export const isMouseInArea = () => {
  if (nodeState.clickedNodeId.length > 0) {
    console.log(nodeState.clickedLocation)
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
