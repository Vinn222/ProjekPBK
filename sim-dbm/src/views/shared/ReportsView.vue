<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import StatCard from '@/components/common/StatCard.vue'
import { useReport } from '@/composables/useReport'
import ReportTables from '@/features/reports/ReportTables.vue'
import { downloadCSV, toCSV } from '@/utils/csv'
import { addDays, isValidISODate, todayISO } from '@/utils/date'
import { formatNumber, formatRupiah } from '@/utils/format'

const to = ref(todayISO())
const from = ref(addDays(todayISO(), -30))
const rangeError = computed(() => {
  if (!isValidISODate(from.value) || !isValidISODate(to.value)) return 'Tanggal tidak valid.'
  return from.value > to.value ? 'Tanggal awal tidak boleh setelah tanggal akhir.' : ''
})

const report = useReport(
  computed(() => (rangeError.value ? '' : from.value)),
  computed(() => (rangeError.value ? '' : to.value))
)

function exportCSV() {
  const columns = [
    { key: 'customer_name', label: 'Hotel' },
    { key: 'order_count', label: 'Order' },
    { key: 'quantity', label: 'Jumlah (pcs)' },
    { key: 'total', label: 'Total' },
    { key: 'paid', label: 'Terbayar' },
    { key: 'remaining', label: 'Sisa piutang' }
  ]
  downloadCSV(`rekap-${from.value}-sd-${to.value}.csv`, toCSV(columns, report.byCustomer.value))
}
</script>

<template>
  <div class="stack">
    <PageHeader title="Laporan" subtitle="Rekap order dan piutang berdasarkan tanggal order.">
      <BaseButton variant="secondary" :disabled="Boolean(rangeError)" @click="exportCSV">Unduh CSV</BaseButton>
    </PageHeader>
    <section class="card filter-bar">
      <BaseInput v-model="from" label="Dari tanggal" type="date" :error="rangeError" />
      <BaseInput v-model="to" label="Sampai tanggal" type="date" />
    </section>
    <div class="stat-grid">
      <StatCard title="Jumlah order" :value="report.summary.value.order_count" />
      <StatCard title="Barang (pcs)" :value="formatNumber(report.summary.value.quantity)" />
      <StatCard title="Total penjualan" :value="formatRupiah(report.summary.value.total)" variant="info" />
      <StatCard title="Sisa piutang" :value="formatRupiah(report.summary.value.remaining)" variant="danger" />
    </div>
    <ReportTables :by-customer="report.byCustomer.value" :by-product="report.byProduct.value" />
  </div>
</template>
