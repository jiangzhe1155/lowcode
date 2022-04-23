import { createRouter, createWebHashHistory } from 'vue-router'
import Designer from '../views/designer/Designer.vue'
import Preview from '../views/designer/Preview.vue'

import Overview from '../views/designer/Overview.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/designer'
  }, {
    path: '/designer',
    name: 'Designer',
    component: Designer
  },{
    path: '/lowCode/overview',
    name: 'Overview',
    component: Overview
  },{
    path: '/preview',
    name: 'Preview',
    component: Preview
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
