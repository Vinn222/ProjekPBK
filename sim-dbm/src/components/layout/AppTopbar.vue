<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import RoleSwitcher from './RoleSwitcher.vue'

defineProps({
  userName: { type: String, default: '' },
  roles: { type: Array, default: () => [] },
  activeRole: { type: String, default: '' }
})
defineEmits(['change-role', 'logout'])
</script>

<template>
  <header class="topbar">
    <strong>{{ userName }}</strong>
    <div class="row">
      <RoleSwitcher v-if="roles.length > 1" :roles="roles" :active-role="activeRole" @change-role="$emit('change-role', $event)" />
      <BaseButton variant="secondary" small @click="$emit('logout')">Keluar</BaseButton>
    </div>
  </header>
</template>
