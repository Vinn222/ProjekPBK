<script setup>
import { APP_NAME, APP_SUBTITLE } from '@/utils/constants'
</script>

<template>
  <div class="auth-layout">
    <div class="auth-box stack">
      <div>
        <h1>{{ APP_NAME }}</h1>
        <div class="text-muted">{{ APP_SUBTITLE }}</div>
      </div>
      <RouterView />
    </div>
  </div>
</template>
