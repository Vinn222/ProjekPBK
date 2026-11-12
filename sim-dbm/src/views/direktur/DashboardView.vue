<script setup>
import StatCard from '@/components/common/StatCard.vue'
import UrgentBillsCard from '@/features/dashboard/UrgentBillsCard.vue'
import { useDashboardStats } from '@/composables/useDashboardStats'
import { formatNumber, formatRupiah } from '@/utils/format'

const stats = useDashboardStats()
</script>

<template>
  <div class="stack">
    <div class="page-header"><h1>Dashboard Direktur</h1></div>
    <div class="stat-grid">
      <StatCard title="Order minggu ini" :value="stats.weekOrderCount.value" />
      <StatCard title="Barang minggu ini (pcs)" :value="formatNumber(stats.weekQuantity.value)" />
      <StatCard title="Total piutang berjalan" :value="formatRupiah(stats.outstandingTotal.value)" variant="info" />
      <StatCard title="Tagihan terlambat" :value="stats.overdueCount.value" variant="danger" />
    </div>
    <UrgentBillsCard :rows="stats.urgentBills.value" />
  </div>
</template>
