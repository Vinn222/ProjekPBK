import { isValidISODate } from '../utils/date'

export const isBlank = (value) => value === null || value === undefined || String(value).trim() === ''
// Bilangan bulat > 0 (menolak "0", "-5", "1.5", "abc")
export const isPositiveInt = (value) => /^\d+$/.test(String(value).trim()) && Number(value) > 0
export const isDate = (value) => isValidISODate(value)
export const PHONE_PATTERN = /^[0-9+\-\s()]{6,20}$/
