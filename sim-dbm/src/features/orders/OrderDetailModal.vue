<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import { DELIVERY_STATUS_LABELS, ORDER_STATUS_LABELS } from '@/utils/constants'
import { formatDate } from '@/utils/date'
import { formatNumber, formatRupiah } from '@/utils/format'

defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null }, // baris dari useOrderRows
  items: { type: Array, default: () => [] }, // [{ product_name, packing_design, quantity, unit_price }]
  recordedBy: { type: String, default: '-' },
  deliveryDate: { type: String, default: null }
})
defineEmits(['close'])

const columns = [
  { key: 'product_name', label: 'Produk' },
  { key: 'packing_design', label: 'Desain packing' },
  { key: 'quantity', label: 'Jumlah', align: 'right' },
  { key: 'unit_price', label: 'Harga', align: 'right' },
  { key: 'subtotal', label: 'Subtotal', align: 'right' }
]
</script>

<template>
  <BaseModal :open="open" :title="`Order ${order?.order_number ?? ''}`" wide @close="$emit('close')">
    <template v-if="order">
      <dl class="detail-grid">
        <div><dt>Hotel</dt><dd>{{ order.customer_name }}</dd></div>
        <div><dt>Tanggal order</dt><dd>{{ formatDate(order.order_date) }}</dd></div>
        <div><dt>Kirim diminta</dt><dd>{{ formatDate(order.requested_delivery_date) }}</dd></div>
        <div><dt>Dicatat oleh</dt><dd>{{ recordedBy }}</dd></div>
        <div><dt>Status</dt><dd>{{ ORDER_STATUS_LABELS[order.status] }}</dd></div>
        <div><dt>Pengiriman</dt><dd>{{ order.delivery_status ? DELIVERY_STATUS_LABELS[order.delivery_status] : 'Belum dijadwalkan' }}{{ deliveryDate ? ` (${formatDate(deliveryDate)})` : '' }}</dd></div>
      </dl>
      <DataTable :columns="columns" :rows="items">
        <template #cell-quantity="{ value }">{{ formatNumber(value) }}</template>
        <template #cell-unit_price="{ value }">{{ formatRupiah(value) }}</template>
        <template #cell-subtotal="{ row }">{{ formatRupiah(row.quantity * row.unit_price) }}</template>
      </DataTable>
      <p><strong>Total: {{ formatRupiah(order.total) }}</strong></p>
      <p v-if="order.notes" class="text-muted">Catatan: {{ order.notes }}</p>
    </template>
    <template #actions><BaseButton variant="secondary" @click="$emit('close')">Tutup</BaseButton></template>
  </BaseModal>
</template>
