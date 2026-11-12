<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useOrderRows } from '@/composables/useOrderRows'
import { usePermission } from '@/composables/usePermission'
import OrderDetailModal from '@/features/orders/OrderDetailModal.vue'
import OrderFormModal from '@/features/orders/OrderFormModal.vue'
import OrderTable from '@/features/orders/OrderTable.vue'
import { cancelOrder, createOrder, deleteOrder, orderHasPayments, updateOrder } from '@/services/orders'
import { useAuthStore } from '@/stores/auth'
import { useCustomerPricesStore } from '@/stores/customerPrices'
import { useCustomersStore } from '@/stores/customers'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrderItemsStore } from '@/stores/orderItems'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'
import { CHANNELS, MESSAGES, ORDER_STATUS_LABELS } from '@/utils/constants'
import { todayISO } from '@/utils/date'

const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermission()
const customers = useCustomersStore()
const products = useProductsStore()
const prices = useCustomerPricesStore()
const orderItems = useOrderItemsStore()
const deliveries = useDeliveriesStore()
const users = useUsersStore()
const rows = useOrderRows()

const search = ref('')
const statusFilter = ref('')
const statusOptions = Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => ({ value, label }))
const filtered = computed(() => {
  const term = search.value.trim().toLowerCase()
  return rows.value.filter(
    (row) =>
      (!statusFilter.value || row.status === statusFilter.value) &&
      (!term || row.order_number.toLowerCase().includes(term) || row.customer_name.toLowerCase().includes(term))
  )
})

const formOpen = ref(false)
const editing = ref(null)
const detail = ref(null)
const cancelling = ref(null)
const deleting = ref(null)

const findPrice = (customerId, productId, design) =>
  prices.find(customerId, productId, design)?.unit_price ?? null
const designsFor = (customerId, productId) =>
  prices.byCustomer(customerId).filter((p) => p.product_id === Number(productId)).map((p) => p.packing_design)

const initialItems = computed(() => (editing.value ? orderItems.byOrder(editing.value.id) : []))
const detailItems = computed(() =>
  detail.value
    ? orderItems.byOrder(detail.value.id).map((item) => ({ ...item, product_name: products.byId(item.product_id)?.name ?? '-' }))
    : []
)

function openCreate() { editing.value = null; formOpen.value = true }
function openEdit(row) { editing.value = row; formOpen.value = true }

function save({ header, items }) {
  if (editing.value) updateOrder(editing.value.id, header, items)
  else createOrder(header, items, auth.userId)
  formOpen.value = false
  ui.notify(MESSAGES.saved)
}

function confirmCancel() {
  cancelOrder(cancelling.value.id)
  cancelling.value = null
  ui.notify('Order dibatalkan.', 'info')
}

function confirmDelete() {
  const result = deleteOrder(deleting.value.id)
  deleting.value = null
  ui.notify(result.ok ? MESSAGES.deleted : result.message, result.ok ? 'success' : 'error', 6000)
}
</script>

<template>
  <div>
    <PageHeader title="Order" subtitle="Faktur penerimaan order dari hotel.">
      <BaseButton v-if="can('order:create')" @click="openCreate">Order baru</BaseButton>
    </PageHeader>
    <section class="card">
      <div class="filter-bar">
        <BaseInput v-model="search" label="Cari" placeholder="No. order atau nama hotel" />
        <BaseSelect v-model="statusFilter" label="Status" :options="statusOptions" placeholder="Semua" />
        <BaseButton variant="secondary" small @click="search = ''; statusFilter = ''">Reset filter</BaseButton>
      </div>
      <OrderTable
        :rows="filtered"
        :can-update="can('order:update')"
        :can-delete="can('order:delete')"
        @detail="detail = $event"
        @edit="openEdit"
        @cancel="cancelling = $event"
        @delete="deleting = $event"
      />
    </section>
    <OrderFormModal
      :open="formOpen"
      :order="editing"
      :initial-items="initialItems"
      :customers="customers.active"
      :products="products.active"
      :find-price="findPrice"
      :designs-for="designsFor"
      :items-locked="editing ? orderHasPayments(editing.id) : false"
      :defaults="{ order_date: todayISO(), channel: CHANNELS[0].value }"
      @submit="save"
      @close="formOpen = false"
    />
    <OrderDetailModal
      :open="Boolean(detail)"
      :order="detail"
      :items="detailItems"
      :recorded-by="users.byId(detail?.recorded_by)?.name ?? '-'"
      :delivery-date="detail ? deliveries.byOrder(detail.id)?.delivery_date ?? null : null"
      @close="detail = null"
    />
    <ConfirmDialog
      :open="Boolean(cancelling)"
      :message="`Batalkan order ${cancelling?.order_number ?? ''}? Tagihan dan pengirimannya ikut tidak ditampilkan.`"
      confirm-label="Ya, batalkan"
      @confirm="confirmCancel"
      @cancel="cancelling = null"
    />
    <ConfirmDialog
      :open="Boolean(deleting)"
      :message="`Hapus permanen order ${deleting?.order_number ?? ''}? Order yang sudah ada pembayaran atau sudah terkirim tidak bisa dihapus.`"
      @confirm="confirmDelete"
      @cancel="deleting = null"
    />
  </div>
</template>
