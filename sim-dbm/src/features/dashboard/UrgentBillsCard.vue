<script setup>
import UrgentBillList from '@/features/bills/UrgentBillList.vue'

defineProps({
  rows: { type: Array, required: true }
})
</script>

<template>
  <section class="card">
    <h2>Tagihan yang perlu ditindaklanjuti</h2>
    <UrgentBillList :rows="rows" />
  </section>
</template>
