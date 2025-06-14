import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import FriendView from '@/views/friend/FriendView.vue'
import LoginView from '@/views/LoginView.vue'
import authMiddleware from '@/middleware/auth-middleware'

// Khai báo rõ kiểu cho mảng route
const routes: RouteRecordRaw[] = [
  { path: '', redirect: '/friend' },
  { 
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { hideHeader: true }
  },
  {
    path: '/friend',
    name: 'Friend',
    component: FriendView,
    meta: {
      hideHeader: false,
      requiresAuth: true,
      roles: ['admin'] as string[]
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Middleware kiểm tra xác thực
router.beforeEach(authMiddleware)

export default router
