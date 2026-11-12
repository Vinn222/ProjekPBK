import { isBlank, isPositiveInt } from './rules'

export function validatePrice(data, { prices = [], editingId = null } = {}) {
  const errors = {}
  if (isBlank(data.product_id)) errors.product_id = 'Produk wajib dipilih.'
  const design = String(data.packing_design ?? '').trim()
  if (!design) errors.packing_design = 'Desain packing wajib diisi.'
  if (isBlank(data.unit_price)) errors.unit_price = 'Harga wajib diisi.'
  else if (!isPositiveInt(data.unit_price)) errors.unit_price = 'Harga harus bilangan bulat lebih dari 0.'
  else if (Number(data.unit_price) > 100000000) errors.unit_price = 'Harga terlalu besar.'
  if (!errors.product_id && design) {
    const duplicate = prices.some(
      (p) => p.id !== editingId && p.product_id === Number(data.product_id) &&
        p.packing_design.toLowerCase() === design.toLowerCase()
    )
    if (duplicate) errors.packing_design = 'Harga untuk produk dan desain ini sudah ada.'
  }
  return errors
}
