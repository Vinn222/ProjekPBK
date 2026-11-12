import { WEEKDAYS } from '../utils/constants'
import { PHONE_PATTERN, isBlank } from './rules'

export function validateCustomer(data, { customers = [], editingId = null } = {}) {
  const errors = {}
  const others = customers.filter((c) => c.id !== editingId)
  const name = String(data.name ?? '').trim()
  const code = String(data.code ?? '').trim().toLowerCase()
  if (!name) errors.name = 'Nama hotel wajib diisi.'
  else if (name.length > 100) errors.name = 'Nama hotel maksimal 100 karakter.'
  else if (others.some((c) => c.name.toLowerCase() === name.toLowerCase())) errors.name = 'Nama hotel sudah ada.'
  if (!code) errors.code = 'Kode wajib diisi.'
  else if (others.some((c) => c.code.toLowerCase() === code)) errors.code = 'Kode sudah dipakai hotel lain.'
  if (!isBlank(data.phone) && !PHONE_PATTERN.test(String(data.phone).trim())) errors.phone = 'Nomor telepon tidak valid.'
  if (!WEEKDAYS.some((d) => d.value === data.exchange_day)) errors.exchange_day = 'Hari tukar faktur wajib dipilih.'
  return errors
}
