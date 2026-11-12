import { defineStore } from 'pinia'
import { MESSAGES, SESSION_KEY } from '@/utils/constants'
import { readJSON, removeKey, writeJSON } from '@/utils/storage'
import { useUsersStore } from './users'

export const useAuthStore = defineStore('auth', {
  state: () => ({ userId: null, activeRole: null }),
  getters: {
    user() {
      return this.userId ? useUsersStore().byId(this.userId) : null
    },
    isLoggedIn() {
      return Boolean(this.user)
    },
    roles() {
      return this.user?.roles ?? []
    }
  },
  actions: {
    // Pulihkan sesi dari localStorage (dipanggil setelah data pengguna dimuat)
    restoreSession() {
      const session = readJSON(SESSION_KEY)
      const user = session ? useUsersStore().byId(session.user_id) : null
      if (user && user.active && user.roles.includes(session.active_role)) {
        this.userId = user.id
        this.activeRole = session.active_role
      } else {
        this.clearSession()
      }
    },
    login(username, password) {
      const user = useUsersStore().byUsername(username)
      if (!user || user.password !== password) return { ok: false, message: MESSAGES.loginFailed }
      if (!user.active) return { ok: false, message: MESSAGES.loginInactive }
      this.userId = user.id
      this.activeRole = user.roles[0]
      this.saveSession()
      return { ok: true }
    },
    setActiveRole(role) {
      if (!this.roles.includes(role)) return false
      this.activeRole = role
      this.saveSession()
      return true
    },
    logout() {
      this.clearSession()
    },
    saveSession() {
      writeJSON(SESSION_KEY, { user_id: this.userId, active_role: this.activeRole })
    },
    clearSession() {
      this.userId = null
      this.activeRole = null
      removeKey(SESSION_KEY)
    }
  }
})
