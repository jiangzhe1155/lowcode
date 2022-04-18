import {
  currentComponent, currentComponentFromArea, fetchDirection, iframeDoc,
  isAffixPanel,
  isDragging, isInside, isPanelOpen,
  locationState, onComponentDragEnd, scrollToTopOrBottom,
  startDrag, updateLocationState,
  x,
  y
} from '@/views/designer/common'
import { onDocumentMouseDrag, onDocumentMouseDragEnd } from '@/views/designer/windowEvent'

export const onIframeMouseDrag = (e: MouseEvent) => {
  console.log('鼠标拖动', e.clientX, e.clientY)
  x.value = e.clientX + 80 + (isAffixPanel.value && isPanelOpen.value ? 500 : 0)
  y.value = e.clientY + 70
  if (startDrag.value && !isDragging.value) {
    isDragging.value = true
    document.addEventListener('mouseup', onDocumentMouseDragEnd, true)
    document.addEventListener('mousemove', onDocumentMouseDrag, true)
  }
}

export const onIframeMouseUp = (e: Event) => {
  console.log('鼠标抬起', e)
  let componentLocation = currentComponent(<Node>e.target)
  if (componentLocation) {
    locationState.currentClickComponent = componentLocation
  }

  onComponentDragEnd()
  iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
}

export const onIframeMouseDown = (e: MouseEvent) => {
  console.log('iframe 按下')
  startDrag.value = true
  locationState.currentPressComponent = currentComponent(<Node>e.target)
  iframeDoc().addEventListener('mousemove', onIframeMouseDrag, true)
  e.stopPropagation()
  e.preventDefault()
}

export const onIframeMouseClick = (e: MouseEvent) => {
  console.log('点击事件')
  e.stopPropagation()
  e.preventDefault()
}

export const onIframeMouseMove = (e: MouseEvent) => {
  if (isInside()) {
    locationState.currentInsertionComponent = currentComponentFromArea(e.clientX, e.clientY)
    locationState.direction = fetchDirection(e.clientX, e.clientY)
    scrollToTopOrBottom()
  }
}

export const onIframeMouseOver = (e: MouseEvent) => {
  if (e && e.target) {
    locationState.currentHoverComponent = currentComponent(<Node>e.target)
  }
}

export const onIframeMouseLeave = (e: Event) => {
  console.log('鼠标移出', e)
  locationState.currentHoverComponent = undefined
}

export const onIframeMouseIn = (e: Event) => {
  console.log('鼠标移入', e)
}

export const onIframeResize = () => {
  updateLocationState()
}

export const onIframeScroll = (e: Event) => {
  console.log('屏幕滚动', e)
  updateLocationState()
}
