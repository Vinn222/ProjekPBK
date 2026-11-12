const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
})

const number = new Intl.NumberFormat('id-ID')

export function formatRupiah(value) {
  return rupiah.format(Number(value) || 0)
}

export function formatNumber(value) {
  return number.format(Number(value) || 0)
}

// Ambil label dari daftar {value, label}
export function labelOf(options, value) {
  return options.find((item) => item.value === value)?.label ?? '-'
}
