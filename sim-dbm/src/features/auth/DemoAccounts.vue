<script setup>
import { ROLE_LABELS } from '@/utils/constants'

defineProps({
  accounts: { type: Array, required: true }, // [{ id, name, username, password, roles }]
  notice: { type: String, default: '' }
})
defineEmits(['pick'])
</script>

<template>
  <div class="card">
    <h2>Akun demo</h2>
    <p v-if="notice" class="text-muted text-small">{{ notice }}</p>
    <div class="stack" style="gap: 8px">
      <button
        v-for="account in accounts"
        :key="account.id"
        type="button"
        class="btn btn-secondary"
        style="text-align: left"
        @click="$emit('pick', account)"
      >
        <strong>{{ account.username }}</strong> / {{ account.password }}<br />
        <span class="text-muted text-small">{{ account.roles.map((role) => ROLE_LABELS[role]).join(', ') }}</span>
      </button>
    </div>
  </div>
</template>
