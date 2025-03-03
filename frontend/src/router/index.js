import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";

const routes = [
  { path: "/", component: Auth }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
