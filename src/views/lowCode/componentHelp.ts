import { onBeforeUnmount, onMounted, onUnmounted, onUpdated, watch } from 'vue'
import { elementMap, emitter, locationMap } from '@/views/lowCode/workbenchStatusMange'

export default function useComponentHelp (props: any, location: any) {
  onMounted(() => {
    emitter.on('onUpdateElement', () => {
      if (elementMap.has(props.element.id)) {
        console.log('更新位置', props.element.id, location)
        locationMap.set(props.element.id, location)
      }
    })
  })

  onUpdated(() => {
    locationMap.set(props.element.id, location)
    location.update()
  })

  watch(location, (n) => {
    locationMap.set(props.element.id, location)
    location.update()
  })

  return {}
}
