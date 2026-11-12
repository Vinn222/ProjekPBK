import { SEED_VERSION, SEED_VERSION_KEY } from '@/utils/constants'
import { clearAppStorage, readJSON, writeJSON } from '@/utils/storage'
import { useAuthStore } from './auth'
import { useBillsStore } from './bills'
import { useCollectionNotesStore } from './collectionNotes'
import { useCustomerPricesStore } from './customerPrices'
import { useCustomersStore } from './customers'
import { useDeliveriesStore } from './deliveries'
import { useOrderItemsStore } from './orderItems'
import { useOrdersStore } from './orders'
import { usePaymentsStore } from './payments'
import { useProductsStore } from './products'
import { useUsersStore } from './users'

const collectionStores = () => [
  useUsersStore(),
  useCustomersStore(),
  useProductsStore(),
  useCustomerPricesStore(),
  useOrdersStore(),
  useOrderItemsStore(),
  useDeliveriesStore(),
  useBillsStore(),
  usePaymentsStore(),
  useCollectionNotesStore()
]

// Dipanggil sekali sebelum aplikasi dipasang:
// periksa versi seed, muat tiap koleksi (dari localStorage, atau salin dari seed bila kosong),
// lalu pulihkan sesi login.
export function initializeData() {
  if (readJSON(SEED_VERSION_KEY) !== SEED_VERSION) {
    clearAppStorage()
    writeJSON(SEED_VERSION_KEY, SEED_VERSION)
  }
  collectionStores().forEach((store) => store.load())
  useAuthStore().restoreSession()
}

// Kembalikan semua data ke data contoh (seed) dan keluarkan sesi
export function resetAllToSeed() {
  collectionStores().forEach((store) => store.resetToSeed())
  useAuthStore().logout()
}
