<script setup>
import { useId } from 'vue'

defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  options: { type: Array, default: () => [] }, // [{ value, label }]
  placeholder: { type: String, default: 'Pilih...' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
const selectId = useId()
</script>

<template>
  <div :class="['field', { 'has-error': error }]">
    <label v-if="label" :for="selectId">{{ label }}</label>
    <select :id="selectId" :value="modelValue" :disabled="disabled" @change="$emit('update:modelValue', $event.target.value)">
      <option value="" disabled>{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
    <span v-if="error" class="field-error">{{ error }}</span>
  </div>
</template>
