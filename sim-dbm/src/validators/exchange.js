import { WEEKDAYS } from '../utils/constants'
import { weekdayOf } from '../utils/date'
import { isDate } from './rules'

// context: { deliveryDate } tanggal kirim order; null bila order belum dikirim/dijadwalkan
export function validateExchange(data, { deliveryDate = null } = {}) {
  const errors = {}
  if (!isDate(data.exchange_date)) errors.exchange_date = 'Tanggal tukar faktur tidak valid.'
  else if (!deliveryDate) errors.exchange_date = 'Pengiriman order ini belum dijadwalkan.'
  else if (data.exchange_date < deliveryDate) errors.exchange_date = 'Tanggal tukar faktur tidak boleh sebelum tanggal kirim.'
  return errors
}

// Peringatan (tidak memblokir) bila bukan hari tukar faktur hotel
export function exchangeDayWarning(exchangeDate, exchangeDay) {
  if (!isDate(exchangeDate) || !exchangeDay) return ''
  if (weekdayOf(exchangeDate) === exchangeDay) return ''
  const label = WEEKDAYS.find((d) => d.value === exchangeDay)?.label ?? exchangeDay
  return `Peringatan: hari tukar faktur hotel ini adalah ${label}. Tanggal tetap boleh disimpan.`
}
