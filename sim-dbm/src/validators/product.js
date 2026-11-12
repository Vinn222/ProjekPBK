export function validateProduct(data, { products = [], editingId = null } = {}) {
  const errors = {}
  const others = products.filter((p) => p.id !== editingId)
  const name = String(data.name ?? '').trim()
  const code = String(data.code ?? '').trim().toLowerCase()
  if (!name) errors.name = 'Nama produk wajib diisi.'
  else if (name.length > 100) errors.name = 'Nama produk maksimal 100 karakter.'
  else if (others.some((p) => p.name.toLowerCase() === name.toLowerCase())) errors.name = 'Nama produk sudah ada.'
  if (!code) errors.code = 'Kode wajib diisi.'
  else if (others.some((p) => p.code.toLowerCase() === code)) errors.code = 'Kode sudah dipakai produk lain.'
  if (!String(data.unit ?? '').trim()) errors.unit = 'Satuan wajib diisi.'
  return errors
}
