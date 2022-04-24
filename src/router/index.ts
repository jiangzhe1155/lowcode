import { createRouter, createWebHashHistory } from 'vue-router'
import Designer from '../views/designer/Designer.vue'
import Preview from '../views/designer/Preview.vue'

import Viewport from '../views/designer/layout/canvas/viewport/Viewport.vue'

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
    path: '/designer/viewport',
    name: 'Viewport',
    component: Viewport
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
