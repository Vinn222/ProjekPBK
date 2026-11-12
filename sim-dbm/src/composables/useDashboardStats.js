import { computed } from 'vue'
import { BILL_DUE_STATUS, DELIVERY_STATUS } from '@/utils/constants'
import { todayISO, weekRange } from '@/utils/date'
import { useBillsStore } from '@/stores/bills'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useOrdersStore } from '@/stores/orders'

// Angka ringkasan dashboard. Semua nilai dihitung dari store, tidak ada angka tertulis di komponen.
export function useDashboardStats() {
  const bills = useBillsStore()
  const orders = useOrdersStore()
  const orderItems = useOrderItemsStore()
  const deliveries = useDeliveriesStore()

  const urgentStatuses = [BILL_DUE_STATUS.NEAR_DUE, BILL_DUE_STATUS.DUE_TODAY, BILL_DUE_STATUS.OVERDUE]
  const countStatus = (status) => bills.rows.filter((row) => row.due_status === status).length

  const urgentBills = computed(() =>
    bills.rows
      .filter((row) => urgentStatuses.includes(row.due_status))
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
  )

  const weekOrders = computed(() => {
    const { start, end } = weekRange(todayISO())
    return orders.active.filter((order) => order.order_date >= start && order.order_date <= end)
  })

  return {
    urgentBills,
    overdueCount: computed(() => countStatus(BILL_DUE_STATUS.OVERDUE)),
    nearDueCount: computed(() => countStatus(BILL_DUE_STATUS.NEAR_DUE)),
    dueTodayCount: computed(() => countStatus(BILL_DUE_STATUS.DUE_TODAY)),
    awaitingExchangeCount: computed(() => countStatus(BILL_DUE_STATUS.AWAITING_EXCHANGE)),
    outstandingTotal: computed(() =>
      bills.rows.filter((row) => row.due_status !== BILL_DUE_STATUS.PAID).reduce((sum, row) => sum + row.remaining, 0)
    ),
    weekOrderCount: computed(() => weekOrders.value.length),
    weekQuantity: computed(() =>
      weekOrders.value.reduce((sum, order) => sum + orderItems.quantityByOrder(order.id), 0)
    ),
    pendingDeliveryCount: computed(
      () => deliveries.items.filter((item) => item.status !== DELIVERY_STATUS.DELIVERED).length
    )
  }
}
