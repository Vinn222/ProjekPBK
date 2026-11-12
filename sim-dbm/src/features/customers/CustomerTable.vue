<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { WEEKDAYS } from '@/utils/constants'
import { labelOf } from '@/utils/format'

defineProps({
  rows: { type: Array, required: true },
  editable: { type: Boolean, default: false }
})
defineEmits(['edit', 'delete'])

const columns = [
  { key: 'code', label: 'Kode' },
  { key: 'name', label: 'Nama hotel' },
  { key: 'phone', label: 'Telepon' },
  { key: 'contact_name', label: 'Kontak' },
  { key: 'exchange_day', label: 'Hari tukar faktur' },
  { key: 'active', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Belum ada hotel.">
    <template #cell-exchange_day="{ value }">{{ labelOf(WEEKDAYS, value) }}</template>
    <template #cell-active="{ value }"><StatusBadge :label="value ? 'Aktif' : 'Nonaktif'" :variant="value ? 'success' : 'neutral'" /></template>
    <template v-if="editable" #actions="{ row }">
      <BaseButton variant="secondary" small @click="$emit('edit', row)">Ubah</BaseButton>
      <BaseButton variant="danger" small @click="$emit('delete', row)">Hapus</BaseButton>
    </template>
  </DataTable>
</template>
