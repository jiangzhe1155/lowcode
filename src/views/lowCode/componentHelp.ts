import { onBeforeUnmount, onMounted, onUnmounted, onUpdated, toRaw, toRefs, unref, watch } from 'vue'
import { elementMap, emitter, locationMap, nodeStateOnHover } from '@/views/lowCode/workbenchStatusMange'

export default function useComponentHelp (props: any, location: any) {
  onMounted(() => {
    console.log('初始化', props.element.id)
    emitter.on('onUpdateElement', () => {
      if (elementMap.has(props.element.id)) {
        notifyLocationChange()
      }
    })
  })

  onUpdated(() => {
    notifyLocationChange()
  })

  watch(location, (n) => {
    notifyLocationChange()
  })

  function onHover (state: boolean) {
    window.parent.postMessage(
      {
        type: 'onHover',
        location: {
          left: location.left,
          top: location.top,
          width: location.width,
          height: location.height
        },
        element: toRaw(elementMap.get(props.element.id)),
        state: state
      }, '*')
  }

  function notifyLocationChange () {
    // console.log('位置编号', props.element.id)
    window.parent.postMessage(
      {
        type: 'locationChange',
        location: {
          left: location.left,
          top: location.top,
          width: location.width,
          height: location.height
        },
        elementId: props.element.id,
      }, '*')
  }

  return {
    onHover,
    notifyLocationChange
  }
}
