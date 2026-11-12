import { WEEKDAYS } from '@/utils/constants'

export const customerFields = [
  { key: 'code', label: 'Kode', type: 'text' },
  { key: 'name', label: 'Nama hotel', type: 'text' },
  { key: 'address', label: 'Alamat', type: 'text' },
  { key: 'phone', label: 'Telepon', type: 'text' },
  { key: 'contact_name', label: 'Nama kontak', type: 'text' },
  { key: 'exchange_day', label: 'Hari tukar faktur', type: 'select', options: WEEKDAYS },
  { key: 'active', label: 'Hotel aktif', type: 'checkbox' }
]

export const emptyCustomer = () => ({ code: '', name: '', address: '', phone: '', contact_name: '', exchange_day: 'monday', active: true })
