import {
  currentComponent,
  iframeDoc,
  isAffixPanel,
  isDragging, isPanelOpen,
  locationState,
  startDrag,
  x,
  y
} from '@/views/designer/common'
import { onDocumentMouseDrag, onDocumentMouseDragEnd } from '@/views/designer/windowEvent'

export const onIframeMouseDrag = (e: MouseEvent) => {
  console.log('鼠标拖动', e.clientX, e.clientY)
  if (startDrag.value) {
    isDragging.value = true
    x.value = e.clientX + 80 + (isAffixPanel.value && isPanelOpen.value ? 500 : 0)
    y.value = e.clientY + 70
    document.addEventListener('mouseup', onDocumentMouseDragEnd, true)
    document.addEventListener('mousemove', onDocumentMouseDrag, true)
  }
}

export const onIframeMouseUp = (e: Event) => {
  console.log('鼠标抬起', e)
  // 应该当做是一个点击事件
  let componentLocation = currentComponent(<Node>e.target)
  if (componentLocation) {
    locationState.currentClickComponent = componentLocation
  }
  startDrag.value = false
  isDragging.value = false
  locationState.currentPressComponent = undefined
  iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
}

export const onIframeMouseDown = (e: MouseEvent) => {
  console.log('iframe 按下')
  startDrag.value = true
  locationState.currentPressComponent = currentComponent(<Node>e.target)
  e.stopPropagation()
  e.preventDefault()
  iframeDoc().addEventListener('mousemove', onIframeMouseDrag, true)
}
