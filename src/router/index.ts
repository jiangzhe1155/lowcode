import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Workbench from "../views/lowCode/workbench.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    redirect: "/lowCode/workbench"
  },
  {
    path: "/about",
    name: "About",
    component: About
  }, {
    path: "/lowCode/workbench",
    name: "lc-workbench",
    component: Workbench
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
