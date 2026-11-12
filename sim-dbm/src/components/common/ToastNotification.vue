<script setup>
defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'success' } // success | error | info
})
defineEmits(['dismiss'])
</script>

<template>
  <div :class="['toast', `toast-${type}`]" role="status">
    <span>{{ message }}</span>
    <button type="button" aria-label="Tutup" @click="$emit('dismiss')">×</button>
  </div>
</template>
