import seed from '@/seed/orders.json'
import { ORDER_STATUS } from '@/utils/constants'
import { defineCollectionStore } from './collection'

export const useOrdersStore = defineCollectionStore('orders', seed, {
  getters: {
    active: (state) => state.items.filter((order) => order.status !== ORDER_STATUS.CANCELLED),
    // Nomor order berikutnya, mis. ORD-2026-0009
    nextOrderNumber: (state) => {
      const year = new Date().getFullYear()
      const next = state.items.reduce((max, order) => Math.max(max, order.id), 0) + 1
      return `ORD-${year}-${String(next).padStart(4, '0')}`
    }
  }
})
