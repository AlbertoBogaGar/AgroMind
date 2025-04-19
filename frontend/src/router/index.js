import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../views/Auth.vue'
import Dashboard from '@/views/Dashboard.vue'
import Cultivos from '@/views/Cultivos.vue'
import Clima from '@/views/Clima.vue'
import DetalleCultivo from '@/views/DetalleCutivo.vue'
import Asistente from '@/views/Asistente.vue'

const routes = [
  { path: '/', component: Auth },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: '/cultivos',
    name: 'Cultivos',
    component: Cultivos,
  },
  {
    path: '/clima',
    name: Clima,
    component: Clima,
  },
  {
    path: '/cultivo/:id',
    name: 'DetalleCultivo',
    component: DetalleCultivo,
    meta: { requiresAuth: true },
  },
  {
    path: '/asistente',
    name: 'Asistente',
    component: Asistente,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
