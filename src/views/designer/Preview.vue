<script lang="ts" setup>

import { h, reactive, ref, resolveComponent, toRaw, VNode } from 'vue'
import { Component } from '@/views/designer/service/component'
import { renderPageStore } from '@/stores/constant'
import { useRequest } from 'vue-request'
import axios from 'axios'
import { initData } from '@/views/designer/service/common'



const renderPage = renderPageStore
const state = reactive<any>(eval(renderPage.value?.state!)())
const ctx = reactive<any>({})
// 创建每个数据源的初始数据
initData(ctx, renderPage.value)
let tableId = renderPage.value.component.children[0].children[0].id
console.log(ctx, ctx[tableId], tableId, renderPage.value.component, 'ctx')

// 加载数据源
let {
  run,
  loading
} = useRequest((params) => axios.post(`/api/getUsers`, {
  pageNo: ctx[tableId].pageNo,
  pageSize: ctx[tableId].pageSize
}), {
  onSuccess: (res) => {
    console.log('获取到数据', res.data)
    state.userList = res.data.data
    ctx[tableId].total = res.data.total
  },
})

state.dataMap = {}
state.dataMap.run = run
state.dataMap.loading = loading

function doRender (node: Component): VNode | undefined {
  let resolve = resolveComponent(node.type)
  if (node.visible) {
    if (node.children.length > 0) {
      return h(resolve, {
        state: state,
        component: node,
        ctx: ctx,
        id: node.id,
      }, () => {
        return node.children.map((e: any) => doRender(e)).filter((m: any) => m)
      })
    } else {
      return h(resolve as any, {
        state: state,
        component: node,
        ctx: ctx,
        id: node.id,
      })
    }
  }
}

const componentRender = () => {
  if (renderPage.value && state) {
    return doRender(renderPage.value?.component)
  } else {
    return h('div')
  }
}

const componentModel = () => {
  return h('div', {}, renderPage.value?.models.map(m => doRender(m)))
}

</script>

<template>
  <componentRender/>
  <componentModel/>
</template>

<style scoped>
</style>
