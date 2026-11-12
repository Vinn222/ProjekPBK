<script setup>
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { DELIVERY_STATUS_LABELS } from '@/utils/constants'
import { formatDate } from '@/utils/date'

defineProps({
  rows: { type: Array, required: true } // baris dari deliveries store (rows)
})

const columns = [
  { key: 'order_number', label: 'No. Order' },
  { key: 'customer_name', label: 'Hotel' },
  { key: 'delivery_date', label: 'Tanggal kirim' },
  { key: 'status', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Belum ada pengiriman.">
    <template #cell-delivery_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-status="{ value }">
      <StatusBadge :label="DELIVERY_STATUS_LABELS[value]" :variant="value === 'delivered' ? 'success' : 'info'" />
    </template>
  </DataTable>
</template>
