import api from '@/utils/rest-util'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export default function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Check required Auth
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('access_token')

    if (!token) {
      return next({ name: 'Login' })
    }

    // Get Infor user
    api.get('/inf', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.status === 200) {
          const userRoles: string[] = response.data?.data || []

          // Verify rule of user
          const routeRoles = to.meta.roles as string[] || []
          const hasAccess = routeRoles.some(role => userRoles.includes(role))

          if (!hasAccess) {
            alert(`You don't have permission to access this page.`)
            return next({ name: 'Login' })
          }

          return next()
        } else {
          return next({ name: 'Login' })
        }
      })
      .catch(() => {
        return next({ name: 'Login' })
      })
  } else {
    return next()
  }
}
