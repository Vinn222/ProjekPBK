import { isBlank, isDate } from './rules'

export function validateNote(data) {
  const errors = {}
  if (!isDate(data.note_date)) errors.note_date = 'Tanggal tidak valid.'
  if (isBlank(data.result)) errors.result = 'Hasil penagihan wajib diisi.'
  else if (String(data.result).trim().length < 3) errors.result = 'Hasil penagihan terlalu singkat.'
  if (!isBlank(data.promise_date)) {
    if (!isDate(data.promise_date)) errors.promise_date = 'Tanggal janji bayar tidak valid.'
    else if (isDate(data.note_date) && data.promise_date < data.note_date) {
      errors.promise_date = 'Janji bayar tidak boleh sebelum tanggal catatan.'
    }
  }
  return errors
}
