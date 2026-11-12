import { isBlank, isDate } from './rules'

// context: { orderDate, couriers: [{id}] }
export function validateDelivery(data, { orderDate = null, couriers = [] } = {}) {
  const errors = {}
  if (isBlank(data.order_id)) errors.order_id = 'Order wajib dipilih.'
  if (!isDate(data.delivery_date)) errors.delivery_date = 'Tanggal kirim tidak valid.'
  else if (orderDate && data.delivery_date < orderDate) errors.delivery_date = 'Tanggal kirim tidak boleh sebelum tanggal order.'
  if (isBlank(data.courier_id)) errors.courier_id = 'Pengantar wajib dipilih.'
  else if (!couriers.some((c) => c.id === Number(data.courier_id))) errors.courier_id = 'Pengantar tidak valid.'
  return errors
}
