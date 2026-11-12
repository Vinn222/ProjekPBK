<script setup>
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  variant: { type: String, default: 'primary' } // primary | warning | danger | info
})
</script>

<template>
  <div :class="['card', 'stat-card', variant]">
    <div class="stat-label">{{ title }}</div>
    <div class="stat-value">{{ value }}</div>
  </div>
</template>
