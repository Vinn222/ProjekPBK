<script setup>
import { computed } from 'vue'
import PageHeader from '@/components/common/PageHeader.vue'
import DeliveryTable from '@/features/deliveries/DeliveryTable.vue'
import { advanceDeliveryStatus } from '@/services/deliveries'
import { useAuthStore } from '@/stores/auth'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useUiStore } from '@/stores/ui'

const auth = useAuthStore()
const deliveries = useDeliveriesStore()
const ui = useUiStore()

const rows = computed(() =>
  deliveries.rowsByCourier(auth.userId).sort((a, b) => a.delivery_date.localeCompare(b.delivery_date))
)

function advance(row) {
  const result = advanceDeliveryStatus(row.id)
  ui.notify(result.ok ? 'Status pengiriman diperbarui.' : result.message, result.ok ? 'success' : 'error')
}
</script>

<template>
  <div>
    <PageHeader title="Pengiriman Saya" subtitle="Hanya pengiriman yang ditugaskan kepada Anda." />
    <section class="card">
      <DeliveryTable :rows="rows" :show-courier="false" can-update-status @advance="advance" />
    </section>
  </div>
</template>
