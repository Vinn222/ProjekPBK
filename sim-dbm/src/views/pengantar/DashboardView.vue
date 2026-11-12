<script setup>
import { computed } from 'vue'
import StatCard from '@/components/common/StatCard.vue'
import DeliveryList from '@/features/deliveries/DeliveryList.vue'
import { useAuthStore } from '@/stores/auth'
import { useDeliveriesStore } from '@/stores/deliveries'
import { DELIVERY_STATUS } from '@/utils/constants'

const auth = useAuthStore()
const deliveries = useDeliveriesStore()

const mine = computed(() => deliveries.rowsByCourier(auth.userId))
const pending = computed(() => mine.value.filter((row) => row.status !== DELIVERY_STATUS.DELIVERED))
const doneCount = computed(() => mine.value.length - pending.value.length)
</script>

<template>
  <div class="stack">
    <div class="page-header"><h1>Dashboard Pengantar</h1></div>
    <div class="stat-grid">
      <StatCard title="Pengiriman belum selesai" :value="pending.length" variant="info" />
      <StatCard title="Pengiriman selesai" :value="doneCount" />
    </div>
    <section class="card">
      <h2>Pengiriman yang harus diantar</h2>
      <DeliveryList :rows="pending" />
    </section>
  </div>
</template>
