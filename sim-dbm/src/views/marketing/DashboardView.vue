<script setup>
import StatCard from '@/components/common/StatCard.vue'
import UrgentBillsCard from '@/features/dashboard/UrgentBillsCard.vue'
import { useDashboardStats } from '@/composables/useDashboardStats'

const stats = useDashboardStats()
</script>

<template>
  <div class="stack">
    <div class="page-header"><h1>Dashboard Marketing</h1></div>
    <div class="stat-grid">
      <StatCard title="Order minggu ini" :value="stats.weekOrderCount.value" />
      <StatCard title="Mendekati jatuh tempo" :value="stats.nearDueCount.value" variant="warning" />
      <StatCard title="Tagihan terlambat" :value="stats.overdueCount.value" variant="danger" />
    </div>
    <UrgentBillsCard :rows="stats.urgentBills.value" />
  </div>
</template>
