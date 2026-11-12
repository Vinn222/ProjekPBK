import seed from '@/seed/bills.json'
import { ORDER_STATUS } from '@/utils/constants'
import { getBillDueStatus, getDaysToDue, getDueDate } from '@/utils/billing'
import { todayISO } from '@/utils/date'
import { defineCollectionStore } from './collection'
import { useOrdersStore } from './orders'
import { useOrderItemsStore } from './orderItems'
import { useCustomersStore } from './customers'
import { usePaymentsStore } from './payments'

export const useBillsStore = defineCollectionStore('bills', seed, {
  getters: {
    byOrder: (state) => (orderId) => state.items.find((bill) => bill.order_id === Number(orderId)) ?? null,
    // Baris tagihan siap tampil. Total, sisa, jatuh tempo, dan status jatuh tempo
    // adalah nilai turunan yang dihitung di sini, bukan disimpan.
    rows(state) {
      const orders = useOrdersStore()
      const orderItems = useOrderItemsStore()
      const customers = useCustomersStore()
      const payments = usePaymentsStore()
      const today = todayISO()
      return state.items
        .map((bill) => {
          const order = orders.byId(bill.order_id)
          if (!order || order.status === ORDER_STATUS.CANCELLED) return null
          const total = orderItems.totalByOrder(order.id)
          const paid = payments.totalByBill(bill.id)
          return {
            ...bill,
            order_number: order.order_number,
            customer_id: order.customer_id,
            customer_name: customers.byId(order.customer_id)?.name ?? '-',
            total,
            paid,
            remaining: Math.max(total - paid, 0),
            due_date: getDueDate(bill.exchange_date),
            days_to_due: getDaysToDue(bill.exchange_date, today),
            due_status: getBillDueStatus(bill, today)
          }
        })
        .filter(Boolean)
    }
  }
})
