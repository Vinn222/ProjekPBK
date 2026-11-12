import { BUSINESS_RULES, CHANNELS } from '../utils/constants'
import { isBlank, isDate, isPositiveInt } from './rules'

// data: { customer_id, order_date, requested_delivery_date, channel, items: [{ product_id, packing_design, quantity }] }
// context.findPrice(customerId, productId, design) -> harga atau null
export function validateOrder(data, { findPrice = () => null } = {}) {
  const errors = {}
  if (isBlank(data.customer_id)) errors.customer_id = 'Hotel wajib dipilih.'
  if (!isDate(data.order_date)) errors.order_date = 'Tanggal order tidak valid.'
  if (!isDate(data.requested_delivery_date)) errors.requested_delivery_date = 'Tanggal kirim diminta tidak valid.'
  else if (isDate(data.order_date) && data.requested_delivery_date < data.order_date) {
    errors.requested_delivery_date = 'Tanggal kirim tidak boleh sebelum tanggal order.'
  }
  if (!CHANNELS.some((c) => c.value === data.channel)) errors.channel = 'Saluran order wajib dipilih.'

  const items = data.items ?? []
  if (!items.length) errors.items = 'Minimal satu barang harus diisi.'
  const seen = new Set()
  items.forEach((item, i) => {
    if (isBlank(item.product_id)) errors[`items.${i}.product_id`] = 'Pilih produk.'
    if (isBlank(item.packing_design)) errors[`items.${i}.packing_design`] = 'Pilih desain packing.'
    if (isBlank(item.quantity)) errors[`items.${i}.quantity`] = 'Jumlah wajib diisi.'
    else if (!isPositiveInt(item.quantity)) errors[`items.${i}.quantity`] = 'Jumlah harus bilangan bulat lebih dari 0.'
    else if (Number(item.quantity) > BUSINESS_RULES.maxQuantityPerItem) {
      errors[`items.${i}.quantity`] = `Jumlah maksimal ${BUSINESS_RULES.maxQuantityPerItem} pcs per item.`
    }
    if (!isBlank(item.product_id) && !isBlank(item.packing_design)) {
      const key = `${item.product_id}|${item.packing_design}`
      if (seen.has(key)) errors[`items.${i}.product_id`] = 'Produk dan desain ini sudah ada di order.'
      seen.add(key)
      if (!isBlank(data.customer_id) && findPrice(data.customer_id, item.product_id, item.packing_design) === null) {
        errors[`items.${i}.packing_design`] = 'Harga belum diatur untuk hotel ini.'
      }
    }
  })
  return errors
}
