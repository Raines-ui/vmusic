import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";
import index from "../views/index/index.vue";
import login from "../views/login/index.vue";

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
  },
  {
    path: "/login",
    name: "login",
    component: login
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;