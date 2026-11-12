import { PAYMENT_METHODS } from '@/utils/constants'

export const paymentFields = [
  { key: 'payment_date', label: 'Tanggal bayar', type: 'date' },
  { key: 'amount', label: 'Jumlah bayar (Rp)', type: 'number' },
  { key: 'method', label: 'Metode bayar', type: 'select', options: PAYMENT_METHODS },
  { key: 'notes', label: 'Catatan (opsional)', type: 'text' }
]

export const noteFields = [
  { key: 'note_date', label: 'Tanggal penagihan', type: 'date' },
  { key: 'result', label: 'Hasil penagihan', type: 'text' },
  { key: 'promise_date', label: 'Janji bayar (opsional)', type: 'date' }
]

export const exchangeFields = [{ key: 'exchange_date', label: 'Tanggal tukar faktur', type: 'date' }]
