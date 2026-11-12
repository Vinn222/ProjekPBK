import seed from '@/seed/order_items.json'
import { defineCollectionStore } from './collection'

export const useOrderItemsStore = defineCollectionStore('order_items', seed, {
  getters: {
    byOrder: (state) => (orderId) => state.items.filter((item) => item.order_id === Number(orderId)),
    // Total dihitung, tidak disimpan
    totalByOrder() {
      return (orderId) =>
        this.byOrder(orderId).reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
    },
    quantityByOrder() {
      return (orderId) => this.byOrder(orderId).reduce((sum, item) => sum + item.quantity, 0)
    }
  },
  actions: {
    removeByOrder(orderId) {
      this.items = this.items.filter((item) => item.order_id !== Number(orderId))
    }
  }
})
