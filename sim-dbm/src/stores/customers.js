import seed from '@/seed/customers.json'
import { defineCollectionStore } from './collection'

export const useCustomersStore = defineCollectionStore('customers', seed, {
  getters: { active: (state) => state.items.filter((customer) => customer.active) }
})
