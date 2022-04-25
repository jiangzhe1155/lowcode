<script lang="ts" setup>
import BorderClicked from '@/views/designer/layout/detection/BorderClicked.vue'
import BorderHover from '@/views/designer/layout/detection/BorderHover.vue'
import BorderPress from '@/views/designer/layout/detection/BorderPress.vue'
import Insertion from '@/views/designer/layout/detection/Insertion.vue'
import { onMounted, ref, toRaw, watch } from 'vue'
import {
  back, deleteComponent,
  iframeDoc,
  iframeRef,
  iframeWin,
  locationState,
  renderPage,
  updateLocationState
} from '@/views/designer/service/common'
import { sendIframeMessage } from '@/views/designer/service/iframeUtil'
import {
  onIframeMouseClick,
  onIframeMouseDown, onIframeMouseIn,
  onIframeMouseLeave, onIframeMouseMove,
  onIframeMouseOver,
  onIframeMouseUp, onIframeResize, onIframeScroll,
  timeout
} from '@/views/designer/service/iframeEvent'
import { useMagicKeys } from '@vueuse/core'

const el = ref<HTMLElement>()
onMounted(() => {
  iframeRef.value = el.value
})

const onLoad = () => {
  let doc = iframeDoc()
  let win = iframeWin()
  if (win) {
    sendIframeMessage(iframeWin(), 'render', {
      renderPage: toRaw(renderPage.value)
    })
  }

  doc.addEventListener('mousedown', (e: MouseEvent) => {
    timeout.value = setTimeout(
        () => onIframeMouseDown(e),
        200,
    ) as unknown as number
    e.preventDefault()
    e.stopPropagation()
  }, true)

  doc.addEventListener('mouseup', onIframeMouseUp, false)
  doc.addEventListener('mouseover', onIframeMouseOver, true)
  doc.addEventListener('mouseleave', onIframeMouseLeave, false)
  doc.addEventListener('mouseenter', onIframeMouseIn, false)
  doc.addEventListener('iframeMouseMove', onIframeMouseMove, true)
  doc.addEventListener('click', onIframeMouseClick, true)
  doc.addEventListener('scroll', onIframeScroll, true)
  doc.onselectstart = () => false // 禁止搜索
  win.addEventListener('resize', onIframeResize, true)
}

watch([renderPage, () => iframeWin()], (n, o) => {
  console.log('renderPage变化了', renderPage)
  if (renderPage && iframeWin()) {
    onLoad()
  }
  setTimeout(() => {
    updateLocationState()
  })
}, { deep: true })

const {
  Ctrl_Z,
  Backspace
} = useMagicKeys()

watch(Ctrl_Z, (v) => {
  if (v) {
    back()
  }
})

watch(Backspace, (v) => {
  if (v) {
    if (locationState.currentClickComponent && locationState.currentHoverComponent && locationState.currentClickComponent.id === locationState.currentHoverComponent.id) {
      deleteComponent(locationState.currentClickComponent.id)
    }
  }
})

</script>
<template>
  <div class="relative h-full shadow border-solid border-1">
    <div id="iframe-holder"
         class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden">
      <div class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
        <BorderHover></BorderHover>
        <BorderClicked></BorderClicked>
        <BorderPress></BorderPress>
        <Insertion></Insertion>
      </div>
      <iframe
          ref="el"
          class="h-full w-full"
          src="/#/designer/viewport"
          @load="onLoad"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>

</style>
