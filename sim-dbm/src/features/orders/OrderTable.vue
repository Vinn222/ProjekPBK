<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { DELIVERY_STATUS_LABELS, ORDER_STATUS_LABELS } from '@/utils/constants'
import { formatDate } from '@/utils/date'
import { formatNumber, formatRupiah } from '@/utils/format'

defineProps({
  rows: { type: Array, required: true },
  canUpdate: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false }
})
defineEmits(['detail', 'edit', 'cancel', 'delete'])

const columns = [
  { key: 'order_number', label: 'No. Order' },
  { key: 'customer_name', label: 'Hotel' },
  { key: 'order_date', label: 'Tgl order' },
  { key: 'requested_delivery_date', label: 'Kirim diminta' },
  { key: 'quantity', label: 'Jumlah (pcs)', align: 'right' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'delivery_status', label: 'Pengiriman' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Belum ada order.">
    <template #cell-order_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-requested_delivery_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-quantity="{ value }">{{ formatNumber(value) }}</template>
    <template #cell-total="{ value }">{{ formatRupiah(value) }}</template>
    <template #cell-status="{ value }">
      <StatusBadge :label="ORDER_STATUS_LABELS[value]" :variant="value === 'cancelled' ? 'neutral' : 'info'" />
    </template>
    <template #cell-delivery_status="{ value }">{{ value ? DELIVERY_STATUS_LABELS[value] : 'Belum dijadwalkan' }}</template>
    <template #actions="{ row }">
      <BaseButton variant="secondary" small @click="$emit('detail', row)">Detail</BaseButton>
      <BaseButton v-if="canUpdate && row.status !== 'cancelled'" variant="secondary" small @click="$emit('edit', row)">Ubah</BaseButton>
      <BaseButton v-if="canDelete && row.status !== 'cancelled'" variant="secondary" small @click="$emit('cancel', row)">Batalkan</BaseButton>
      <BaseButton v-if="canDelete" variant="danger" small @click="$emit('delete', row)">Hapus</BaseButton>
    </template>
  </DataTable>
</template>
