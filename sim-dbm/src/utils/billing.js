import { BILL_DUE_STATUS, BILL_STATUS, BUSINESS_RULES } from './constants'
import { addDays, diffDays } from './date'

// Jatuh tempo = tanggal tukar faktur + 14 hari (usulan, disetujui)
export function getDueDate(exchangeDate) {
  if (!exchangeDate) return null
  return addDays(exchangeDate, BUSINESS_RULES.dueDays)
}

// Sisa hari menuju jatuh tempo (negatif bila sudah lewat)
export function getDaysToDue(exchangeDate, today) {
  const due = getDueDate(exchangeDate)
  if (!due) return null
  return diffDays(due, today)
}

// Status turunan tagihan: lunas, menunggu tukar faktur, belum/mendekati/jatuh tempo, terlambat
export function getBillDueStatus(bill, today) {
  if (bill.status === BILL_STATUS.PAID) return BILL_DUE_STATUS.PAID
  if (!bill.exchange_date) return BILL_DUE_STATUS.AWAITING_EXCHANGE
  const days = getDaysToDue(bill.exchange_date, today)
  if (days < 0) return BILL_DUE_STATUS.OVERDUE
  if (days === 0) return BILL_DUE_STATUS.DUE_TODAY
  if (days <= BUSINESS_RULES.warningDays) return BILL_DUE_STATUS.NEAR_DUE
  return BILL_DUE_STATUS.NOT_DUE
}
