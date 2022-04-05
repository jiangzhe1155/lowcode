import { createRouter, createWebHashHistory } from 'vue-router'
import Workbench from '../views/lowCode/Workbench.vue'
import Overview from '../views/lowCode/main/Overview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/lowCode/workbench'
  },
  {
    path: '/lowCode/workbench',
    name: 'lc-workbench',
    component: Workbench
  },  {
    path: '/lowCode/overview',
    name: 'Overview',
    component: Overview
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
