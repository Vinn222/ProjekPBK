import { useBillsStore } from '@/stores/bills'
import { useCollectionNotesStore } from '@/stores/collectionNotes'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useOrdersStore } from '@/stores/orders'
import { usePaymentsStore } from '@/stores/payments'

// Pemeriksaan keterkaitan sebelum menghapus data master
export const customerInUse = (id) => useOrdersStore().items.some((o) => o.customer_id === Number(id))
export const productInUse = (id) => useOrderItemsStore().items.some((i) => i.product_id === Number(id))
export const userInUse = (id) => {
  const n = Number(id)
  return (
    useOrdersStore().items.some((o) => o.recorded_by === n) ||
    useDeliveriesStore().items.some((d) => d.courier_id === n) ||
    usePaymentsStore().items.some((p) => p.recorded_by === n) ||
    useCollectionNotesStore().items.some((c) => c.noted_by === n)
  )
}
export const billsOfCustomer = (id) => useBillsStore().rows.filter((row) => row.customer_id === Number(id))
