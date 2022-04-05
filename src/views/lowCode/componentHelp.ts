import { onBeforeUnmount, onMounted, onUnmounted, onUpdated, toRaw, toRefs, unref, watch } from 'vue'
import { elementMap, emitter, locationMap, nodeStateOnHover } from '@/views/lowCode/workbenchStatusMange'

export default function useComponentHelp (props: any, location: any) {
  onMounted(() => {
    emitter.on('onUpdateElement', () => {
      if (elementMap.has(props.element.id)) {
        notifyLocationChange();
        //
        // locationMap.set(props.element.id, location)
        // location.update()
      }
    })
  })

  onUpdated(() => {
    notifyLocationChange();
    // locationMap.set(props.element.id, location)
    // location.update()
  })

  watch(location, (n) => {
    notifyLocationChange();

    // locationMap.set(props.element.id, location)
    // location.update()
  })

  function onHover (state: boolean) {
    window.parent.postMessage(
      {
        type: 'onHover',
        location: {left:location.left,top:location.top,width:location.width,height:location.height},
        element:toRaw(elementMap.get(props.element.id)),
        state:state
      }, '*')
  }

  function notifyLocationChange(){
    window.parent.postMessage(
      {
        type: 'locationChange',
        location: {left:location.left,top:location.top,width:location.width,height:location.height},
        elementId:props.element.id,
      }, '*')
  }

  return {onHover}
}
