<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { pagesForRole } from '@/config/pages'
import { homePathOf, routeNameOf } from '@/router'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from './AppSidebar.vue'
import AppTopbar from './AppTopbar.vue'

const auth = useAuthStore()
const router = useRouter()

const menuItems = computed(() =>
  pagesForRole(auth.activeRole).map((page) => ({
    key: page.key,
    title: page.title,
    icon: page.icon,
    to: { name: routeNameOf(auth.activeRole, page.key) }
  }))
)

function changeRole(role) {
  if (auth.setActiveRole(role)) router.push(homePathOf(role))
}

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app-shell">
    <AppSidebar :items="menuItems" />
    <div class="main-area">
      <AppTopbar
        :user-name="auth.user?.name ?? ''"
        :roles="auth.roles"
        :active-role="auth.activeRole ?? ''"
        @change-role="changeRole"
        @logout="logout"
      />
      <main class="main-content"><RouterView /></main>
    </div>
  </div>
</template>
