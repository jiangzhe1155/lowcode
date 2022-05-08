<script lang="ts" setup>

import { h, reactive, ref, resolveComponent, VNode } from 'vue'
import { addMessageListener } from '@/views/designer/service/iframeUtil'
import { initData, resetLocationState } from '@/views/designer/service/common'
import { Component } from '@/views/designer/service/component'
import { useResizeObserver } from '@vueuse/core'
import { useRequest } from 'vue-request'
import axios from 'axios'

const all = reactive<any>({
})

function doRender (node: Component): VNode | undefined {
  let resolve = resolveComponent(node.type)
  let el = ref()
  useResizeObserver(el, (entries) => {
    resetLocationState()
  })
  if (node.visible) {
    if (node.children.length > 0) {
      return h(resolve, {
        ref: el,
        state: all.state,
        component: node,
        ctx: all.ctx,
        id: node.id
      }, () => {
        return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
      })
    } else {
      return h(resolve as any, {
        ref: el,
        state: all.state,
        ctx: all.ctx,
        component: node,
        id: node.id
      }, { default: () => h('div', { class: 'bg-gray-200 p-10px select-none' }, '拖拽组件或模板到这里') })
    }
  }
}

const componentRender = () => {
  if (all.renderPage && all.state) {
    console.log('开始渲染',all.renderPage,all.state)

    return doRender(all.renderPage?.component)
  } else {
    return h('div')
  }
}

const componentModel = () => {
  return h('div', {}, all.renderPage?.models.map(m => doRender(m)))
}

addMessageListener('render', (payload: any) => {
  all.renderPage = payload.renderPage
  if (all.state == null) {
    all.state = eval(all.renderPage?.state!)()
  }

  // 创建每个数据源的初始数据
  if(all.renderPage){
    all.ctx = {}
    initData(all.ctx, all.renderPage)
    let tableId = all.renderPage!.component.children[0].children[0].id
    console.log(all.ctx, all.ctx[tableId], tableId, all.renderPage!.component, 'ctx')

    // 加载数据源
    let {
      run,
      loading
    } = useRequest((params) => axios.post(`/api/getUsers`, {
      pageNo: all.ctx[tableId].pageNo,
      pageSize: all.ctx[tableId].pageSize
    }), {
      onSuccess: (res) => {
        console.log('获取到数据', res.data)
        all.state.userList = res.data.data
        all.ctx[tableId].total = res.data.total
      },
    })

    all.state.dataMap = {}
    all.state.dataMap.run = run
    all.state.dataMap.loading = loading
  }

})

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style>


</style>
