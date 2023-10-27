import { createRouter, createWebHistory } from 'vue-router'
const Login = () => import(/* webpackChunkName: "login" */ '@/pages/login/index.vue')

// 静态路由
const staticRoutes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes
})

export default router
