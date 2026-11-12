<script setup>
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Konfirmasi' },
  message: { type: String, default: '' },
  confirmLabel: { type: String, default: 'Ya, lanjutkan' },
  cancelLabel: { type: String, default: 'Batal' }
})
defineEmits(['confirm', 'cancel'])
</script>

<template>
  <BaseModal :open="open" :title="title" @close="$emit('cancel')">
    <p>{{ message }}</p>
    <template #actions>
      <BaseButton variant="secondary" @click="$emit('cancel')">{{ cancelLabel }}</BaseButton>
      <BaseButton variant="danger" @click="$emit('confirm')">{{ confirmLabel }}</BaseButton>
    </template>
  </BaseModal>
</template>
