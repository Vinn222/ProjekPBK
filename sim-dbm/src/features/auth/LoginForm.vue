<script setup>
import { reactive } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps({
  error: { type: String, default: '' } // galat dari proses login (mis. kata sandi salah)
})
const emit = defineEmits(['submit'])

const form = reactive({ username: '', password: '' })
const errors = reactive({ username: '', password: '' })

// Isi form dari akun demo yang dipilih
defineExpose({ fill: (username, password) => Object.assign(form, { username, password }) })

function submit() {
  errors.username = form.username.trim() ? '' : 'Username wajib diisi.'
  errors.password = form.password ? '' : 'Kata sandi wajib diisi.'
  if (errors.username || errors.password) return
  emit('submit', { username: form.username, password: form.password })
}
</script>

<template>
  <form class="card" novalidate @submit.prevent="submit">
    <h2>Masuk</h2>
    <BaseInput v-model="form.username" label="Username" :error="errors.username" autocomplete="username" />
    <BaseInput v-model="form.password" label="Kata sandi" type="password" :error="errors.password" autocomplete="current-password" />
    <p v-if="props.error" class="field-error" role="alert">{{ props.error }}</p>
    <BaseButton type="submit">Masuk</BaseButton>
  </form>
</template>
