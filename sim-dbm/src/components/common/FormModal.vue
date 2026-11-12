<script setup>
import { ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseModal from './BaseModal.vue'
import SchemaForm from './SchemaForm.vue'

// Modal form generik. validate(form) mengembalikan objek galat ({} bila valid).
// Nilai number/select-numeric dikonversi ke Number setelah lolos validasi.
const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
  fields: { type: Array, required: true },
  initial: { type: Object, default: () => ({}) },
  validate: { type: Function, default: () => ({}) },
  submitLabel: { type: String, default: 'Simpan' }
})
const emit = defineEmits(['submit', 'close'])

const form = ref({})
const errors = ref({})

const defaultOf = (field) => (field.type === 'checkbox' ? false : field.type === 'checkbox-group' ? [] : '')

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    const base = Object.fromEntries(props.fields.map((field) => [field.key, defaultOf(field)]))
    form.value = { ...base, ...JSON.parse(JSON.stringify(props.initial)) }
    errors.value = {}
  },
  { immediate: true }
)

function normalize(raw) {
  const result = { ...raw }
  for (const field of props.fields) {
    const value = raw[field.key]
    if (field.type === 'number' || field.numeric) result[field.key] = value === '' ? '' : Number(value)
    else if (typeof value === 'string') result[field.key] = value.trim()
  }
  return result
}

function submit() {
  errors.value = props.validate(form.value)
  if (Object.keys(errors.value).length) return
  emit('submit', normalize(form.value))
}
</script>

<template>
  <BaseModal :open="open" :title="title" @close="emit('close')">
    <form novalidate @submit.prevent="submit">
      <SchemaForm v-model="form" :fields="fields" :errors="errors" />
      <slot name="extra" :form="form" />
      <div class="modal-actions">
        <BaseButton variant="secondary" @click="emit('close')">Batal</BaseButton>
        <BaseButton type="submit">{{ submitLabel }}</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
