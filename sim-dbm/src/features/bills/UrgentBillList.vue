<script setup>
import DataTable from '@/components/common/DataTable.vue'
import { formatDate } from '@/utils/date'
import { formatRupiah } from '@/utils/format'
import DueStatusBadge from './DueStatusBadge.vue'

defineProps({
  rows: { type: Array, required: true } // baris dari bills store (rows)
})

const columns = [
  { key: 'customer_name', label: 'Hotel' },
  { key: 'order_number', label: 'No. Order' },
  { key: 'remaining', label: 'Sisa tagihan', align: 'right' },
  { key: 'due_date', label: 'Jatuh tempo' },
  { key: 'due_status', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Tidak ada tagihan yang perlu ditindaklanjuti.">
    <template #cell-remaining="{ value }">{{ formatRupiah(value) }}</template>
    <template #cell-due_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-due_status="{ row }">
      <DueStatusBadge :status="row.due_status" :days-to-due="row.days_to_due" />
    </template>
  </DataTable>
</template>
