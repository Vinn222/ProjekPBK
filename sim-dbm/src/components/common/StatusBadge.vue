<script setup>
defineProps({
  label: { type: String, required: true },
  variant: { type: String, default: 'neutral' } // neutral | info | success | warning | danger | danger-outline
})
</script>

<template>
  <span :class="['badge', `badge-${variant}`]">{{ label }}</span>
</template>
