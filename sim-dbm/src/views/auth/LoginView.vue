<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DemoAccounts from '@/features/auth/DemoAccounts.vue'
import LoginForm from '@/features/auth/LoginForm.vue'
import { homePathOf } from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useUsersStore } from '@/stores/users'
import { MESSAGES } from '@/utils/constants'

const auth = useAuthStore()
const users = useUsersStore()
const route = useRoute()
const router = useRouter()

const loginForm = ref(null)
const error = ref('')

function handleSubmit({ username, password }) {
  const result = auth.login(username, password)
  if (!result.ok) {
    error.value = result.message
    return
  }
  error.value = ''
  router.push(safeRedirect() || homePathOf(auth.activeRole))
}

// Pakai tujuan semula hanya bila role-nya dimiliki pengguna yang baru login
function safeRedirect() {
  const target = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (!target) return ''
  const role = router.resolve(target).meta.role
  return !role || auth.roles.includes(role) ? target : ''
}

const pickAccount = (account) => loginForm.value?.fill(account.username, account.password)
</script>

<template>
  <LoginForm ref="loginForm" :error="error" @submit="handleSubmit" />
  <DemoAccounts :accounts="users.items.filter((user) => user.active)" :notice="MESSAGES.sampleData" @pick="pickAccount" />
</template>
