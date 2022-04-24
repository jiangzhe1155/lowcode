import {
  add,
  asideComponentGroup,
  asideComponentType, emitter,
  fetchLocation,
  iframeDoc, isAffixPanel,
  isDragging, isPanelOpen,
  isShowInsertion,
  locationState, move, onComponentDragEnd, resetLocationState,
  startDrag,
  x,
  y
} from '@/views/designer/common'
import { onIframeMouseDrag, timeout } from '@/views/designer/iframeEvent'
import { designerConfig } from '@/stores/constant'

export const onDocumentMouseDrag = (e: MouseEvent) => {
  if (startDrag.value && !isDragging.value) {
    isDragging.value = true
  }
  x.value = e.clientX
  y.value = e.clientY

  let {
    asideWidth,
    headerHeight,
    canvasPadding,
    dragPanelWidth
  } = designerConfig

  const event = new MouseEvent('iframeMouseMove', {
    clientX: e.clientX - asideWidth - canvasPadding - (isAffixPanel.value && isPanelOpen.value ? dragPanelWidth : 0),
    clientY: e.clientY - headerHeight - canvasPadding
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
    }, 200)
  }
  onComponentDragEnd()
  resetLocationState()
  clearTimeout(timeout.value)
  timeout.value = null
  e.preventDefault()
  e.stopPropagation()
  document.removeEventListener('mousemove', onDocumentMouseDrag, true)
  document.removeEventListener('mouseup', onDocumentMouseDragEnd, true)
  iframeDoc().removeEventListener('mousemove', onIframeMouseDrag, true)
  emitter.emit('onComponentPanelOpen')

}




