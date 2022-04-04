import { onMounted, onUnmounted, onUpdated, watch } from 'vue'
import { emitter, locationMap } from '@/views/lowCode/workbenchStatusMange'

export default function useComponentHelp(props : any, location:any) {
  onMounted(()=>{
    emitter.on('onUpdateElement',()=>{
      console.log('更新位置',props.element.id, location)
      locationMap.set(props.element.id, location)
    });
  })

  onUnmounted(()=>{
    // emitter.off('onUpdateElement')
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
