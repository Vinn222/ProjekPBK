// Konstanta dan aturan bisnis. Semua label tampilan (bahasa Indonesia) dikumpulkan di sini
// supaya komponen tidak menulis teks atau nilai bisnis secara langsung (hardcode).

export const APP_NAME = 'SIM CV. Devin Berkah Mandiri'
export const APP_SUBTITLE = 'Sistem Informasi Manajemen Supplier Amenities Hotel'

// Penyimpanan
export const STORAGE_PREFIX = 'dbm:'
export const SEED_VERSION_KEY = `${STORAGE_PREFIX}seed-version`
export const SEED_VERSION = '2'
export const SESSION_KEY = `${STORAGE_PREFIX}session`

// Aturan bisnis (usulan)
export const BUSINESS_RULES = {
  dueDays: 14, // jatuh tempo = tanggal tukar faktur + 14 hari
  warningDays: 3, // penanda "mendekati jatuh tempo" bila sisa hari <= 3
  maxQuantityPerItem: 2000, // batas jumlah per item per order
  minPasswordLength: 6
}

// Role
export const ROLES = {
  DIREKTUR: 'direktur',
  ADMIN: 'admin',
  MARKETING: 'marketing',
  COURIER: 'courier'
}

export const ROLE_LABELS = {
  direktur: 'Direktur',
  admin: 'Admin',
  marketing: 'Marketing',
  courier: 'Pengantar Barang'
}

// Segmen URL per role (courier memakai /pengantar)
export const ROLE_PATHS = {
  direktur: 'direktur',
  admin: 'admin',
  marketing: 'marketing',
  courier: 'pengantar'
}

// Status order
export const ORDER_STATUS = { RECEIVED: 'received', CANCELLED: 'cancelled' }
export const ORDER_STATUS_LABELS = {
  received: 'Diterima',
  cancelled: 'Dibatalkan'
}

// Status pengiriman, berurutan
export const DELIVERY_STATUS = {
  SCHEDULED: 'scheduled',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered'
}
export const DELIVERY_STATUS_LABELS = {
  scheduled: 'Dijadwalkan',
  on_the_way: 'Dalam perjalanan',
  delivered: 'Terkirim'
}
export const DELIVERY_NEXT_STATUS = {
  scheduled: 'on_the_way',
  on_the_way: 'delivered',
  delivered: null
}

// Status tagihan yang disimpan
export const BILL_STATUS = {
  NOT_EXCHANGED: 'not_exchanged',
  AWAITING_PAYMENT: 'awaiting_payment',
  PAID: 'paid'
}

// Status tagihan turunan (dihitung dari tanggal)
export const BILL_DUE_STATUS = {
  AWAITING_EXCHANGE: 'awaiting_exchange',
  NOT_DUE: 'not_due',
  NEAR_DUE: 'near_due',
  DUE_TODAY: 'due_today',
  OVERDUE: 'overdue',
  PAID: 'paid'
}
export const BILL_DUE_STATUS_LABELS = {
  awaiting_exchange: 'Menunggu tukar faktur',
  not_due: 'Belum jatuh tempo',
  near_due: 'Mendekati jatuh tempo',
  due_today: 'Jatuh tempo hari ini',
  overdue: 'Terlambat',
  paid: 'Lunas'
}
export const BILL_DUE_STATUS_VARIANTS = {
  awaiting_exchange: 'neutral',
  not_due: 'info',
  near_due: 'warning',
  due_today: 'danger-outline',
  overdue: 'danger',
  paid: 'success'
}

export const CHANNELS = [
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'phone', label: 'Telepon' }
]

export const PAYMENT_METHODS = [
  { value: 'transfer', label: 'Transfer' },
  { value: 'cash', label: 'Tunai' }
]

export const WEEKDAYS = [
  { value: 'monday', label: 'Senin' },
  { value: 'tuesday', label: 'Selasa' },
  { value: 'wednesday', label: 'Rabu' },
  { value: 'thursday', label: 'Kamis' },
  { value: 'friday', label: 'Jumat' },
  { value: 'saturday', label: 'Sabtu' },
  { value: 'sunday', label: 'Minggu' }
]

// Urutan hari sesuai Date.getDay() (0 = Minggu)
export const WEEKDAY_BY_INDEX = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

export const MESSAGES = {
  forbidden: 'Anda tidak memiliki akses ke halaman tersebut.',
  loginRequired: 'Silakan login terlebih dahulu.',
  loginFailed: 'Username atau kata sandi salah.',
  loginInactive: 'Akun ini tidak aktif.',
  saved: 'Data berhasil disimpan.',
  deleted: 'Data berhasil dihapus.',
  seedReset: 'Data dikembalikan ke data contoh.',
  notFound: 'Halaman yang Anda cari tidak ada.',
  sampleData: 'Seluruh data di aplikasi ini adalah data contoh, bukan data asli usaha.'
}
