<script setup>
import { ROLE_LABELS } from '@/utils/constants'

defineProps({
  roles: { type: Array, required: true },
  activeRole: { type: String, default: '' }
})
defineEmits(['change-role'])
</script>

<template>
  <div class="field" style="margin: 0; flex-direction: row; align-items: center">
    <label for="role-switcher">Role aktif</label>
    <select id="role-switcher" :value="activeRole" @change="$emit('change-role', $event.target.value)">
      <option v-for="role in roles" :key="role" :value="role">{{ ROLE_LABELS[role] }}</option>
    </select>
  </div>
</template>
