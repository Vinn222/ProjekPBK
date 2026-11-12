import seed from '@/seed/users.json'
import { defineCollectionStore } from './collection'

export const useUsersStore = defineCollectionStore('users', seed, {
  getters: {
    byUsername: (state) => (username) =>
      state.items.find((user) => user.username === String(username).trim().toLowerCase()) ?? null,
    couriers: (state) => state.items.filter((user) => user.active && user.roles.includes('courier'))
  }
})
