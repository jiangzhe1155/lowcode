import { Component, ComponentProps, Indexable } from './interface/component'
import { Ref, watch } from 'vue'

export const usePropsWatcher = (config: Ref<ComponentProps>, componentProps: Ref<Component>) => {
  watch(config, () => {
    // 深拷贝
    componentProps.value.props = JSON.parse(JSON.stringify(config.value))
  }, { deep: true })

  watch(() => componentProps, () => {
    if (!componentProps || !componentProps.value) {
      return
    }
    let prop = componentProps.value.props
    if (!prop) {
      return
    }
    for (const [key, cVal] of Object.entries(config.value)) {
      if (Reflect.has(prop, key)) {
        let p = prop[key]
        let val = <Indexable>cVal
        val.idx = p.idx
        for (const [pK, pV] of Object.entries(p.options)) {
          if (Reflect.has(val.options, pK)) {
            val.options[pK] = pV
          }
        }
      }
    }
  }, {
    immediate: true
  })
}
