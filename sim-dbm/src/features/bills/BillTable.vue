<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import { formatDate } from '@/utils/date'
import { formatRupiah } from '@/utils/format'
import DueStatusBadge from './DueStatusBadge.vue'

defineProps({
  rows: { type: Array, required: true },
  canPay: { type: Boolean, default: false }
})
defineEmits(['detail', 'pay'])

const columns = [
  { key: 'customer_name', label: 'Hotel' },
  { key: 'order_number', label: 'No. Order' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'remaining', label: 'Sisa', align: 'right' },
  { key: 'exchange_date', label: 'Tukar faktur' },
  { key: 'due_date', label: 'Jatuh tempo' },
  { key: 'due_status', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Belum ada tagihan.">
    <template #cell-total="{ value }">{{ formatRupiah(value) }}</template>
    <template #cell-remaining="{ value }">{{ formatRupiah(value) }}</template>
    <template #cell-exchange_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-due_date="{ value }">{{ formatDate(value) }}</template>
    <template #cell-due_status="{ row }"><DueStatusBadge :status="row.due_status" :days-to-due="row.days_to_due" /></template>
    <template #actions="{ row }">
      <BaseButton variant="secondary" small @click="$emit('detail', row)">Detail</BaseButton>
      <BaseButton v-if="canPay && row.due_status !== 'paid' && row.exchange_date" small @click="$emit('pay', row)">Bayar</BaseButton>
    </template>
  </DataTable>
</template>
