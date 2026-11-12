<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import { formatRupiah } from '@/utils/format'

defineProps({
  rows: { type: Array, required: true }, // [{ id, product_name, packing_design, unit_price }]
  editable: { type: Boolean, default: false }
})
defineEmits(['edit', 'delete'])

const columns = [
  { key: 'product_name', label: 'Produk' },
  { key: 'packing_design', label: 'Desain packing' },
  { key: 'unit_price', label: 'Harga per pcs', align: 'right' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows" empty-text="Belum ada harga untuk hotel ini.">
    <template #cell-unit_price="{ value }">{{ formatRupiah(value) }}</template>
    <template v-if="editable" #actions="{ row }">
      <BaseButton variant="secondary" small @click="$emit('edit', row)">Ubah</BaseButton>
      <BaseButton variant="danger" small @click="$emit('delete', row)">Hapus</BaseButton>
    </template>
  </DataTable>
</template>
