import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginComponent.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    // Guardia de ruta: protegemos el acceso a esta ruta
    beforeEnter: (to, from, next) => {
      // Comprobamos si el token existe en localStorage
      const token = localStorage.getItem('token')
      if (token) {
        // Si existe el token, permitimos el acceso a la ruta
        next()
      } else {
        // Si no existe el token, redirigimos al login
        next('/')
      }
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
