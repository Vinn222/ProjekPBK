<script setup>
import { APP_NAME } from '@/utils/constants'

defineProps({
  items: { type: Array, required: true } // [{ key, title, icon, to }]
})
</script>

<template>
  <nav class="sidebar" aria-label="Menu utama">
    <div class="sidebar-title">{{ APP_NAME }}</div>
    <RouterLink v-for="item in items" :key="item.key" :to="item.to">
      <span aria-hidden="true">{{ item.icon }}</span>
      <span>{{ item.title }}</span>
    </RouterLink>
  </nav>
</template>
