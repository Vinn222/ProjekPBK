import { DELIVERY_STATUS, ORDER_STATUS } from '@/utils/constants'
import { useBillsStore } from '@/stores/bills'
import { useCollectionNotesStore } from '@/stores/collectionNotes'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useOrdersStore } from '@/stores/orders'
import { usePaymentsStore } from '@/stores/payments'

export function orderHasPayments(orderId) {
  const bill = useBillsStore().byOrder(orderId)
  return Boolean(bill && usePaymentsStore().byBill(bill.id).length)
}

const cleanItems = (items) =>
  items.map((item) => ({
    product_id: Number(item.product_id),
    packing_design: item.packing_design,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_price)
  }))

// Buat order baru beserta item dan tagihannya (tagihan otomatis "belum tukar faktur")
export function createOrder(header, items, userId) {
  const orders = useOrdersStore()
  const order = orders.add({
    order_number: orders.nextOrderNumber,
    customer_id: Number(header.customer_id),
    recorded_by: userId,
    order_date: header.order_date,
    requested_delivery_date: header.requested_delivery_date,
    channel: header.channel,
    status: ORDER_STATUS.RECEIVED,
    notes: header.notes ?? ''
  })
  cleanItems(items).forEach((item) => useOrderItemsStore().add({ ...item, order_id: order.id }))
  useBillsStore().add({ order_id: order.id, exchange_date: null, status: 'not_exchanged' })
  return order
}

// Ubah order. Item dikunci bila sudah ada pembayaran (items = null berarti item tidak diubah)
export function updateOrder(orderId, header, items) {
  useOrdersStore().update(orderId, {
    customer_id: Number(header.customer_id),
    order_date: header.order_date,
    requested_delivery_date: header.requested_delivery_date,
    channel: header.channel,
    notes: header.notes ?? ''
  })
  if (items && !orderHasPayments(orderId)) {
    const store = useOrderItemsStore()
    store.removeByOrder(orderId)
    cleanItems(items).forEach((item) => store.add({ ...item, order_id: orderId }))
  }
}

export function cancelOrder(orderId) {
  useOrdersStore().update(orderId, { status: ORDER_STATUS.CANCELLED })
}

// Hapus permanen. Ditolak bila sudah ada pembayaran (hanya boleh dibatalkan).
export function deleteOrder(orderId) {
  if (orderHasPayments(orderId)) {
    return { ok: false, message: 'Order sudah memiliki pembayaran, hanya boleh dibatalkan.' }
  }
  const delivery = useDeliveriesStore().byOrder(orderId)
  if (delivery && delivery.status === DELIVERY_STATUS.DELIVERED) {
    return { ok: false, message: 'Order sudah terkirim, hanya boleh dibatalkan.' }
  }
  const bills = useBillsStore()
  const bill = bills.byOrder(orderId)
  if (bill) {
    const notes = useCollectionNotesStore()
    notes.items = notes.items.filter((note) => note.bill_id !== bill.id)
    bills.remove(bill.id)
  }
  if (delivery) useDeliveriesStore().remove(delivery.id)
  useOrderItemsStore().removeByOrder(orderId)
  useOrdersStore().remove(orderId)
  return { ok: true }
}
