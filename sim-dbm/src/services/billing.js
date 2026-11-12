import { BILL_STATUS } from '@/utils/constants'
import { useBillsStore } from '@/stores/bills'
import { useCollectionNotesStore } from '@/stores/collectionNotes'
import { useOrderItemsStore } from '@/stores/orderItems'
import { usePaymentsStore } from '@/stores/payments'

export function recordExchange(billId, exchangeDate) {
  const bills = useBillsStore()
  const bill = bills.byId(billId)
  if (!bill) return { ok: false, message: 'Tagihan tidak ditemukan.' }
  if (bill.status === BILL_STATUS.PAID) return { ok: false, message: 'Tagihan sudah lunas.' }
  bills.update(billId, { exchange_date: exchangeDate, status: BILL_STATUS.AWAITING_PAYMENT })
  return { ok: true }
}

// Catat pembayaran; tagihan otomatis lunas bila sisa 0
export function recordPayment(billId, data, userId) {
  const bills = useBillsStore()
  const bill = bills.byId(billId)
  const payments = usePaymentsStore()
  payments.add({
    bill_id: billId,
    recorded_by: userId,
    payment_date: data.payment_date,
    amount: Number(data.amount),
    method: data.method,
    notes: data.notes ?? ''
  })
  const total = useOrderItemsStore().totalByOrder(bill.order_id)
  if (payments.totalByBill(billId) >= total) bills.update(billId, { status: BILL_STATUS.PAID })
}

export function addCollectionNote(billId, data, userId) {
  useCollectionNotesStore().add({
    bill_id: billId,
    noted_by: userId,
    note_date: data.note_date,
    result: data.result,
    promise_date: data.promise_date || null
  })
}
