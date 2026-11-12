import { BUSINESS_RULES } from '../utils/constants'

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/

export function validateUser(data, { users = [], editingId = null } = {}) {
  const errors = {}
  if (!String(data.name ?? '').trim()) errors.name = 'Nama wajib diisi.'
  const username = String(data.username ?? '').trim().toLowerCase()
  if (!username) errors.username = 'Username wajib diisi.'
  else if (!USERNAME_PATTERN.test(username)) errors.username = 'Username 3-20 karakter: huruf kecil, angka, atau garis bawah.'
  else if (users.some((u) => u.id !== editingId && u.username === username)) errors.username = 'Username sudah dipakai.'
  const password = String(data.password ?? '')
  if (editingId === null && !password) errors.password = 'Kata sandi wajib diisi.'
  else if (password && password.length < BUSINESS_RULES.minPasswordLength) {
    errors.password = `Kata sandi minimal ${BUSINESS_RULES.minPasswordLength} karakter.`
  }
  if (!Array.isArray(data.roles) || !data.roles.length) errors.roles = 'Pilih minimal satu role.'
  return errors
}
