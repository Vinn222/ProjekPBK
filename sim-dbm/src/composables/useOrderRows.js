import { computed } from 'vue'
import { useBillsStore } from '@/stores/bills'
import { useCustomersStore } from '@/stores/customers'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useOrdersStore } from '@/stores/orders'

// Baris order siap tampil (hotel, jumlah, total, status pengiriman dan tagihan)
export function useOrderRows() {
  const orders = useOrdersStore()
  const customers = useCustomersStore()
  const items = useOrderItemsStore()
  const deliveries = useDeliveriesStore()
  const bills = useBillsStore()

  return computed(() =>
    orders.items
      .map((order) => ({
        ...order,
        customer_name: customers.byId(order.customer_id)?.name ?? '-',
        quantity: items.quantityByOrder(order.id),
        total: items.totalByOrder(order.id),
        delivery_status: deliveries.byOrder(order.id)?.status ?? null,
        due_status: bills.rows.find((row) => row.order_id === order.id)?.due_status ?? null
      }))
      .sort((a, b) => b.order_date.localeCompare(a.order_date) || b.id - a.id)
  )
}
