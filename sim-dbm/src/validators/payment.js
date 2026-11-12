import { PAYMENT_METHODS } from '../utils/constants'
import { isBlank, isDate, isPositiveInt } from './rules'

// context: { remaining, exchangeDate, today }
export function validatePayment(data, { remaining = 0, exchangeDate = null, today = null } = {}) {
  const errors = {}
  if (!exchangeDate) errors.payment_date = 'Tagihan belum ditukar faktur.'
  else if (!isDate(data.payment_date)) errors.payment_date = 'Tanggal bayar tidak valid.'
  else if (data.payment_date < exchangeDate) errors.payment_date = 'Tanggal bayar tidak boleh sebelum tanggal tukar faktur.'
  else if (today && data.payment_date > today) errors.payment_date = 'Tanggal bayar tidak boleh di masa depan.'
  if (isBlank(data.amount)) errors.amount = 'Jumlah bayar wajib diisi.'
  else if (!isPositiveInt(data.amount)) errors.amount = 'Jumlah harus bilangan bulat lebih dari 0.'
  else if (Number(data.amount) > remaining) errors.amount = 'Jumlah melebihi sisa tagihan.'
  if (!PAYMENT_METHODS.some((m) => m.value === data.method)) errors.method = 'Metode bayar wajib dipilih.'
  return errors
}
