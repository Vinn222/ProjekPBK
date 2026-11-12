import { computed } from 'vue'
import { useBillsStore } from '@/stores/bills'
import { useDeliveriesStore } from '@/stores/deliveries'

// Baris tagihan + info pengiriman, diurutkan dari yang paling mendesak
const ORDER = { overdue: 0, due_today: 1, near_due: 2, not_due: 3, awaiting_exchange: 4, paid: 5 }

export function useBillRows() {
  const bills = useBillsStore()
  const deliveries = useDeliveriesStore()
  return computed(() =>
    bills.rows
      .map((row) => ({ ...row, delivery_date: deliveries.byOrder(row.order_id)?.delivery_date ?? null }))
      .sort((a, b) => ORDER[a.due_status] - ORDER[b.due_status] || (a.due_date ?? '9').localeCompare(b.due_date ?? '9'))
  )
}
