import { createRouter, createWebHistory } from "vue-router";
import Auth from "../views/Auth.vue";
import Dashboard from "@/views/Dashboard.vue"; 
import Cultivos from "@/views/Cultivos.vue";
import Clima from "@/views/Clima.vue";

const routes = [
  { path: "/", component: Auth },
  { 
    path: "/dashboard", 
    component: Dashboard,
    meta: { requiresAuth: true } 
  },
  {
    path:'/cultivos',
    name:'Cultivos',
    component:Cultivos
  },
  {
    path:'/clima',
    name:Clima,
    component:Clima
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token"); 

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/"); 
  } else {
    next(); 
  }
});

export default router;
