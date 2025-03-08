import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Dashboard from "@/views/Dashboard.vue"; 

const routes = [
  { path: "/", component: Auth },
  { 
    path: "/dashboard", 
    component: Dashboard,
    meta: { requiresAuth: true } 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🚀 Middleware para proteger rutas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token"); 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/"); 
  } else {
    next(); 
  }
});

export default router;
