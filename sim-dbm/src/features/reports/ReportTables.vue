<script setup>
import DataTable from '@/components/common/DataTable.vue'
import { formatNumber, formatRupiah } from '@/utils/format'

defineProps({
  byCustomer: { type: Array, required: true },
  byProduct: { type: Array, required: true }
})

const customerColumns = [
  { key: 'customer_name', label: 'Hotel' },
  { key: 'order_count', label: 'Order', align: 'right' },
  { key: 'quantity', label: 'Jumlah (pcs)', align: 'right' },
  { key: 'total', label: 'Total', align: 'right' },
  { key: 'paid', label: 'Terbayar', align: 'right' },
  { key: 'remaining', label: 'Sisa piutang', align: 'right' }
]
const productColumns = [
  { key: 'product_name', label: 'Produk' },
  { key: 'quantity', label: 'Jumlah (pcs)', align: 'right' },
  { key: 'revenue', label: 'Nilai', align: 'right' }
]
</script>

<template>
  <div class="stack">
    <section class="card">
      <h2>Rekap per hotel</h2>
      <DataTable :columns="customerColumns" :rows="byCustomer" empty-text="Tidak ada order pada rentang ini.">
        <template #cell-quantity="{ value }">{{ formatNumber(value) }}</template>
        <template #cell-total="{ value }">{{ formatRupiah(value) }}</template>
        <template #cell-paid="{ value }">{{ formatRupiah(value) }}</template>
        <template #cell-remaining="{ value }">{{ formatRupiah(value) }}</template>
      </DataTable>
    </section>
    <section class="card">
      <h2>Rekap per produk</h2>
      <DataTable :columns="productColumns" :rows="byProduct" empty-text="Tidak ada order pada rentang ini.">
        <template #cell-quantity="{ value }">{{ formatNumber(value) }}</template>
        <template #cell-revenue="{ value }">{{ formatRupiah(value) }}</template>
      </DataTable>
    </section>
  </div>
</template>
