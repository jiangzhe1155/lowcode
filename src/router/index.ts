import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/lowCode/workbench'
  },
  {
    path: '/lowCode/workbench',
    name: 'lc-workbench',
    component: () => import('../views/lowCode/workbench.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
