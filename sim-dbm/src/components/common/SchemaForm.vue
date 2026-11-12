<script setup>
import BaseInput from './BaseInput.vue'
import BaseSelect from './BaseSelect.vue'

// Form berbasis skema: fields = [{ key, label, type, options, hint, disabled, min, max }]
// type: text | number | date | password | select | checkbox | checkbox-group
const props = defineProps({
  fields: { type: Array, required: true },
  modelValue: { type: Object, required: true },
  errors: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue'])

const setValue = (key, value) => emit('update:modelValue', { ...props.modelValue, [key]: value })

function toggleGroup(key, value, checked) {
  const current = props.modelValue[key] ?? []
  setValue(key, checked ? [...current, value] : current.filter((item) => item !== value))
}
</script>

<template>
  <div>
    <template v-for="field in fields" :key="field.key">
      <BaseSelect
        v-if="field.type === 'select'"
        :model-value="modelValue[field.key]"
        :label="field.label"
        :options="field.options"
        :error="errors[field.key]"
        :disabled="field.disabled"
        @update:model-value="setValue(field.key, $event)"
      />
      <div v-else-if="field.type === 'checkbox'" class="field">
        <label>
          <input type="checkbox" :checked="modelValue[field.key]" @change="setValue(field.key, $event.target.checked)" />
          {{ field.label }}
        </label>
      </div>
      <fieldset v-else-if="field.type === 'checkbox-group'" :class="['field', { 'has-error': errors[field.key] }]" style="border: 0; padding: 0">
        <label>{{ field.label }}</label>
        <label v-for="option in field.options" :key="option.value" style="font-weight: 400">
          <input
            type="checkbox"
            :checked="(modelValue[field.key] ?? []).includes(option.value)"
            @change="toggleGroup(field.key, option.value, $event.target.checked)"
          />
          {{ option.label }}
        </label>
        <span v-if="errors[field.key]" class="field-error">{{ errors[field.key] }}</span>
      </fieldset>
      <BaseInput
        v-else
        :model-value="modelValue[field.key]"
        :label="field.label"
        :type="field.type === 'number' ? 'text' : field.type"
        :hint="field.hint"
        :placeholder="field.placeholder"
        :error="errors[field.key]"
        :disabled="field.disabled"
        @update:model-value="setValue(field.key, $event)"
      />
    </template>
  </div>
</template>
