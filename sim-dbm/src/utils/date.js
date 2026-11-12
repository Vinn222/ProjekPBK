import { WEEKDAY_BY_INDEX } from './constants'

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/

// Cek format YYYY-MM-DD dan kalender yang valid (mis. 2026-02-30 ditolak)
export function isValidISODate(value) {
  if (typeof value !== 'string' || !ISO_PATTERN.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
}

export function parseISO(value) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISO(new Date())
}

export function addDays(value, days) {
  const date = parseISO(value)
  date.setDate(date.getDate() + days)
  return toISO(date)
}

// Selisih hari (a - b), bilangan bulat
export function diffDays(a, b) {
  const ms = parseISO(a).getTime() - parseISO(b).getTime()
  return Math.round(ms / 86400000)
}

export function weekdayOf(value) {
  return WEEKDAY_BY_INDEX[parseISO(value).getDay()]
}

// Rentang Senin sampai Minggu untuk tanggal tertentu
export function weekRange(value) {
  const date = parseISO(value)
  const offset = (date.getDay() + 6) % 7
  const start = addDays(value, -offset)
  return { start, end: addDays(start, 6) }
}

export function formatDate(value) {
  if (!value || !isValidISODate(value)) return '-'
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(parseISO(value))
}
