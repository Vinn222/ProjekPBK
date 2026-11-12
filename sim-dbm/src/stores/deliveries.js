import seed from '@/seed/deliveries.json'
import { defineCollectionStore } from './collection'
import { useOrdersStore } from './orders'
import { useCustomersStore } from './customers'
import { useUsersStore } from './users'

export const useDeliveriesStore = defineCollectionStore('deliveries', seed, {
  getters: {
    byOrder: (state) => (orderId) => state.items.find((item) => item.order_id === Number(orderId)) ?? null,
    // Baris siap tampil: gabungan pengiriman, order, hotel, pengantar
    rows(state) {
      const orders = useOrdersStore()
      const customers = useCustomersStore()
      const users = useUsersStore()
      return state.items.flatMap((delivery) => {
        const order = orders.byId(delivery.order_id)
        if (!order || order.status === 'cancelled') return []
        const customer = customers.byId(order.customer_id)
        return [{
          ...delivery,
          order_number: order?.order_number ?? '-',
          customer_name: customer?.name ?? '-',
          order_date: order.order_date,
          courier_name: users.byId(delivery.courier_id)?.name ?? '-'
        }]
      })
    },
    rowsByCourier() {
      return (courierId) => this.rows.filter((row) => row.courier_id === Number(courierId))
    }
  }
})
