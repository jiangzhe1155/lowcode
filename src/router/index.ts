import { createRouter, createWebHashHistory } from 'vue-router'
import Workbench from '../views/lowCode/Workbench.vue'
import Overview from '../views/lowCode/main/Overview.vue'
import Workbench2 from '../views/lowCode/Workbench2.vue'

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
  },{
    path: '/lowCode/workbench2',
    name: 'lc-workbench2',
    component: Workbench2
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
