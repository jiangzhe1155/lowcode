import { createRouter, createWebHashHistory } from 'vue-router'
import Workbench from '../views/lowCode/Workbench.vue'
import Overview from '../views/lowCode/main/Overview.vue'
import Designer from '../views/designer/Designer.vue'
import Overview2 from '../views/designer/Overview2.vue'

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
    path: '/lowCode/overview2',
    name: 'Overview2',
    component: Overview2
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
