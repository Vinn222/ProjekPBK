export const productFields = [
  { key: 'code', label: 'Kode', type: 'text' },
  { key: 'name', label: 'Nama produk', type: 'text' },
  { key: 'unit', label: 'Satuan', type: 'text' },
  { key: 'active', label: 'Produk aktif', type: 'checkbox' }
]

export const emptyProduct = () => ({ code: '', name: '', unit: 'pcs', active: true })
