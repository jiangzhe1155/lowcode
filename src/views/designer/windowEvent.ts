import {
  add,
  asideComponentGroup,
  asideComponentType,
  fetchLocation,
  iframeDoc, isAffixPanel,
  isDragging, isPanelOpen,
  isShowInsertion,
  locationState, move, onComponentDragEnd, resetLocationState,
  startDrag,
  x,
  y
} from '@/views/designer/common'
import { onIframeMouseDrag } from '@/views/designer/iframeEvent'

export const onDocumentMouseDrag = (e: MouseEvent) => {
  console.log('主窗口移動')
  if (startDrag.value && !isDragging.value) {
    isDragging.value = true
  }
  x.value = e.clientX
  y.value = e.clientY
  const event = new MouseEvent('iframeMouseMove', {
    clientX: e.clientX - 80 - (isAffixPanel.value && isPanelOpen.value ? 500 : 0),
    clientY: e.clientY - 70
  })
  iframeDoc().dispatchEvent(event)
  e.preventDefault()
  e.stopPropagation()
}

export const onDocumentMouseDragEnd = (e: MouseEvent) => {
  console.log('主窗口抬起')
  if (isShowInsertion.value && locationState.currentInsertionComponent && locationState.direction) {
    let clickId: string
    if (locationState.currentPressComponent) {
      clickId = move(locationState.currentPressComponent?.id, locationState.currentInsertionComponent?.id, locationState.direction)
    } else if (asideComponentType.value && asideComponentGroup.value) {
      clickId = add(asideComponentType.value, asideComponentGroup.value, locationState.currentInsertionComponent?.id, locationState.direction)
    }
    setTimeout(() => {
      locationState.currentClickComponent = fetchLocation(clickId)
    },200)
  }
  onComponentDragEnd()
  resetLocationState()
  e.preventDefault()
  e.stopPropagation()
  document.removeEventListener('mousemove', onDocumentMouseDrag, true)
  document.removeEventListener('mouseup', onDocumentMouseDragEnd, true)
  iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
}




