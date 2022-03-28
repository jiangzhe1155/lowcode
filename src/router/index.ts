import { createRouter, createWebHashHistory } from 'vue-router'
import Workbench from '../views/lowCode/Workbench.vue'

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
