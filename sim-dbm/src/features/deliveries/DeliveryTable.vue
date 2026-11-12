<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { DELIVERY_NEXT_STATUS, DELIVERY_STATUS_LABELS } from '@/utils/constants'
import { formatDate } from '@/utils/date'

defineProps({
  rows: { type: Array, required: true }, // baris dari deliveries store (rows)
  showCourier: { type: Boolean, default: true },
  canSchedule: { type: Boolean, default: false },
  canUpdateStatus: { type: Boolean, default: false }
})
defineEmits(['reschedule', 'advance'])

const NEXT_LABELS = { on_the_way: 'Mulai antar', delivered: 'Tandai terkirim' }
const allColumns = [
  { key: 'order_number', label: 'No. Order' },
  { key: 'customer_name', label: 'Hotel' },
  { key: 'delivery_date', label: 'Tanggal kirim' },
  { key: 'courier_name', label: 'Pengantar' },
  { key: 'status', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="showCourier ? allColumns : allColumns.filter((c) => c.key !== 'courier_name')" :rows="rows" empty-text="Belum ada pengiriman.">
    <template #cell-delivery_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-status="{ value }">
      <StatusBadge :label="DELIVERY_STATUS_LABELS[value]" :variant="value === 'delivered' ? 'success' : value === 'on_the_way' ? 'warning' : 'info'" />
    </template>
    <template v-if="canSchedule || canUpdateStatus" #actions="{ row }">
      <BaseButton v-if="canSchedule && row.status === 'scheduled'" variant="secondary" small @click="$emit('reschedule', row)">Ubah jadwal</BaseButton>
      <BaseButton v-if="canUpdateStatus && DELIVERY_NEXT_STATUS[row.status]" small @click="$emit('advance', row)">
        {{ NEXT_LABELS[DELIVERY_NEXT_STATUS[row.status]] }}
      </BaseButton>
    </template>
  </DataTable>
</template>
