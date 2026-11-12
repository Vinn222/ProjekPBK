import { createRouter, createWebHashHistory } from 'vue-router'
import { PAGES } from '@/config/pages'
import { ROLE_PATHS, ROLES } from '@/utils/constants'
import { useAuthStore } from '@/stores/auth'

export const homePathOf = (role) => `/${ROLE_PATHS[role]}`
export const routeNameOf = (role, pageKey) => `${role}.${pageKey}`

// Dashboard tiap role punya komponen sendiri (views/<role>/DashboardView.vue)
const dashboards = {
  [ROLES.DIREKTUR]: () => import('@/views/direktur/DashboardView.vue'),
  [ROLES.ADMIN]: () => import('@/views/admin/DashboardView.vue'),
  [ROLES.MARKETING]: () => import('@/views/marketing/DashboardView.vue'),
  [ROLES.COURIER]: () => import('@/views/pengantar/DashboardView.vue')
}

// Rute per role dibangkitkan dari config/pages.js: /direktur/..., /admin/..., dst.
const roleRoutes = Object.values(ROLES).map((role) => ({
  path: homePathOf(role),
  component: () => import('@/components/layout/MainLayout.vue'),
  meta: { requiresAuth: true, role },
  children: PAGES.filter((page) => page.roles.includes(role)).map((page) => ({
    path: page.path,
    name: routeNameOf(role, page.key),
    component: page.key === 'dashboard' ? dashboards[role] : page.component,
    meta: { title: page.title }
  }))
}))

const routes = [
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore()
      return auth.isLoggedIn ? homePathOf(auth.activeRole) : '/login'
    }
  },
  {
    path: '/login',
    component: () => import('@/components/layout/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [{ path: '', name: 'login', component: () => import('@/views/auth/LoginView.vue') }]
  },
  ...roleRoutes,
  {
    path: '/forbidden',
    component: () => import('@/components/layout/AuthLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', name: 'forbidden', component: () => import('@/views/shared/ForbiddenView.vue') }]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/components/layout/AuthLayout.vue'),
    children: [{ path: '', name: 'not-found', component: () => import('@/views/shared/NotFoundView.vue') }]
  }
]

export const router = createRouter({ history: createWebHashHistory(), routes })

// Guard: wajib login, dan role pada URL harus dimiliki pengguna.
export function authGuard(to) {
  const auth = useAuthStore()

  if (to.meta.guestOnly) {
    return auth.isLoggedIn ? homePathOf(auth.activeRole) : true
  }
  if (to.meta.requiresAuth) {
    if (!auth.isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
    const role = to.meta.role
    if (role) {
      if (!auth.roles.includes(role)) return { name: 'forbidden' }
      if (auth.activeRole !== role) auth.setActiveRole(role)
    }
  }
  return true
}

router.beforeEach(authGuard)
export default router
