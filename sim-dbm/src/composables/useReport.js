import { computed } from 'vue'
import { useBillsStore } from '@/stores/bills'
import { useCustomersStore } from '@/stores/customers'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useOrdersStore } from '@/stores/orders'
import { useProductsStore } from '@/stores/products'

// Rekap order dan piutang untuk rentang tanggal order (from/to: ref berisi YYYY-MM-DD)
export function useReport(from, to) {
  const orders = useOrdersStore()
  const items = useOrderItemsStore()
  const customers = useCustomersStore()
  const products = useProductsStore()
  const bills = useBillsStore()

  const inRange = computed(() =>
    orders.active.filter(
      (order) => (!from.value || order.order_date >= from.value) && (!to.value || order.order_date <= to.value)
    )
  )

  const byCustomer = computed(() =>
    customers.items
      .map((customer) => {
        const own = inRange.value.filter((o) => o.customer_id === customer.id)
        const billRows = bills.rows.filter((b) => own.some((o) => o.id === b.order_id))
        return {
          id: customer.id,
          customer_name: customer.name,
          order_count: own.length,
          quantity: own.reduce((sum, o) => sum + items.quantityByOrder(o.id), 0),
          total: billRows.reduce((sum, b) => sum + b.total, 0),
          paid: billRows.reduce((sum, b) => sum + b.paid, 0),
          remaining: billRows.reduce((sum, b) => sum + b.remaining, 0)
        }
      })
      .filter((row) => row.order_count > 0)
  )

  const byProduct = computed(() =>
    products.items
      .map((product) => {
        const own = items.items.filter((i) => i.product_id === product.id && inRange.value.some((o) => o.id === i.order_id))
        return {
          id: product.id,
          product_name: product.name,
          quantity: own.reduce((sum, i) => sum + i.quantity, 0),
          revenue: own.reduce((sum, i) => sum + i.quantity * i.unit_price, 0)
        }
      })
      .filter((row) => row.quantity > 0)
  )

  const summary = computed(() => ({
    order_count: inRange.value.length,
    quantity: byCustomer.value.reduce((sum, r) => sum + r.quantity, 0),
    total: byCustomer.value.reduce((sum, r) => sum + r.total, 0),
    paid: byCustomer.value.reduce((sum, r) => sum + r.paid, 0),
    remaining: byCustomer.value.reduce((sum, r) => sum + r.remaining, 0)
  }))

  return { byCustomer, byProduct, summary }
}
