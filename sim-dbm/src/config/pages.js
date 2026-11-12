import { ROLES } from '@/utils/constants'

const ALL = Object.values(ROLES)
const STAFF = [ROLES.DIREKTUR, ROLES.ADMIN, ROLES.MARKETING]

// Daftar halaman: sumber tunggal untuk router dan menu sidebar.

export const PAGES = [
  { key: 'dashboard', path: '', title: 'Dashboard', icon: '▣', roles: ALL },
  { key: 'customers', path: 'customers', title: 'Pelanggan (Hotel)', icon: '▤', roles: STAFF, component: () => import('@/views/shared/CustomersView.vue') },
  { key: 'products', path: 'products', title: 'Produk', icon: '▦', roles: STAFF, component: () => import('@/views/shared/ProductsView.vue') },
  { key: 'prices', path: 'prices', title: 'Harga Pelanggan', icon: '◈', roles: STAFF, component: () => import('@/views/shared/PricesView.vue') },
  { key: 'orders', path: 'orders', title: 'Order', icon: '✎', roles: STAFF, component: () => import('@/views/shared/OrdersView.vue') },
  { key: 'deliveries', path: 'deliveries', title: 'Pengiriman', icon: '➤', roles: [ROLES.DIREKTUR, ROLES.ADMIN], component: () => import('@/views/shared/DeliveriesView.vue') },
  { key: 'my-deliveries', path: 'my-deliveries', title: 'Pengiriman Saya', icon: '➤', roles: [ROLES.COURIER], component: () => import('@/views/pengantar/MyDeliveriesView.vue') },
  { key: 'exchange', path: 'exchange', title: 'Tukar Faktur', icon: '⇄', roles: [ROLES.DIREKTUR, ROLES.ADMIN], component: () => import('@/views/shared/ExchangeView.vue') },
  { key: 'bills', path: 'bills', title: 'Tagihan', icon: '◉', roles: STAFF, component: () => import('@/views/shared/BillsView.vue') },
  { key: 'reports', path: 'reports', title: 'Laporan', icon: '☰', roles: [ROLES.DIREKTUR, ROLES.ADMIN], component: () => import('@/views/shared/ReportsView.vue') },
  { key: 'users', path: 'users', title: 'Pengguna', icon: '☺', roles: [ROLES.DIREKTUR], component: () => import('@/views/direktur/UsersView.vue') }
]

export function pagesForRole(role) {
  return PAGES.filter((page) => page.roles.includes(role))
}
