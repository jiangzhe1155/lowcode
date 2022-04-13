<script setup lang="ts">
import LowCodeAside from '@/views/lowCode/aside/LowCodeAside.vue'
import { useConfigStore } from '@/stores/constant'
import {
  createApp, createVNode,
  h,
  onMounted,
  ref,
  render,
  resolveComponent,
  VNode, watch,
  watchEffect
} from 'vue'
import { Card, Component, Dialog, Page, Root, useRenderPageData } from '@/views/lowCode/service'
import { app } from '@/main'
import CardComponent from '@/views/lowCode/component/CardComponent.vue'
import PageContainer from '@/views/lowCode/component/PageContainer.vue'
import component from '*.vue'
import App from '@/App.vue'
import { ElButton } from 'element-plus'

const store = useConfigStore()
let iframeRef = ref<any>(null)
document.addEventListener('mousemove', (e: MouseEvent) => {
})

const {
  renderPage
} = useRenderPageData('')

// watchEffect(() => {
//   console.log('renderPage 发生变化', iframeRef.value)
//   if (iframeRef.value && iframeRef.value.contentWindow) {
//     setTimeout(() => {
//       let doc = iframeRef.value.contentWindow.document
//       let elementById = doc.createElement('div')
//       elementById.id = 'app'
//       doc.appendChild(elementById)
//       // console.log('elementById', doc, elementById)
//       // let node = doRender(renderPage)
//       // node!.appContext = app._context
//       // console.log('node', node)
//       // render(node!, elementById)
//       // let a = createApp(CardComponent)
//       // a._context = app._context
//       // a.mount(elementById)
//
//     }, 3000)
//   }
// })

function doRender (node: any): VNode | undefined {
  const resolve = resolveComponent(node.type)
  if (node.visible) {
    return h(resolve, {
      element: node,
      id: node.id
    }, () => {
      return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
    })
  }
}

onMounted(() => {

})

const onLoad = () => {
  let doc = iframeRef.value.contentWindow.document

  var linkList = document.getElementsByTagName('link')//获取父窗口link标签对象列表
  var head = doc.getElementsByTagName('head').item(0)

  for (var i = 0; i < linkList.length; i++) {
    var l = doc.createElement('link')
    l.rel = 'stylesheet'
    l.type = 'text/css'
    l.href = linkList[i].href
    head.appendChild(l)
  }

  var scriptList = document.getElementsByTagName("script");
  for (var i = 0; i < scriptList.length; i++) {
    var _script = doc.createElement("script");
    _script.type = 'text/javascript';
    _script.src = scriptList[i].src;
    head.appendChild(_script);
  }

  let body = doc.body
  let el = doc.createElement('div')
  body.appendChild(el)
  el.id = 'app'

  const vnode = h(CardComponent, { id: '123213213' })
  vnode.appContext = app._context
  render(vnode, el)
  console.log(el, app, vnode.el)
}

</script>

<template>
  <el-container class="h-screen">
    <el-header class="!border-b-2" :height="store.headerHeight+'px'">
      <el-button></el-button>
    </el-header>
    <el-container>
      <LowCodeAside></LowCodeAside>
      <el-main class="bg-gray-200 !p-0 !select-none">
        <div class="relative h-full shadow border-solid border-1">
          <div
              class="absolute !bg-gray-100 right-20px left-20px top-20px bottom-20px overflow-y-hidden overflow-x-hidden"
          >
            <div
                class="absolute left-0 top-0 z-800 w-full h-full pointer-events-none">
              <!--              <VisualNodeHelper>-->
              <!--              </VisualNodeHelper>-->
            </div>
            <iframe
                id="workbench-iframe"
                ref="iframeRef" class="h-full w-full" name="Overview"
                @load="onLoad"
            >>
            </iframe>
            <!--            src="http://localhost:3000/#/lowCode/overview2"-->

          </div>
        </div>
      </el-main>
      <el-aside class="border-l-1"></el-aside>
    </el-container>
  </el-container>
</template>

<style scoped>

</style>
