<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  wide: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <div :class="['modal', { 'modal-wide': wide }]" role="dialog" aria-modal="true" :aria-label="title">
      <h2>{{ title }}</h2>
      <slot />
      <div v-if="$slots.actions" class="modal-actions"><slot name="actions" /></div>
    </div>
  </div>
</template>
