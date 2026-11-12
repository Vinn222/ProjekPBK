<script setup>
import { MESSAGES } from '@/utils/constants'
</script>

<template>
  <div class="card stack">
    <h2>Halaman tidak ditemukan</h2>
    <p>{{ MESSAGES.notFound }}</p>
    <RouterLink to="/">Kembali ke beranda</RouterLink>
  </div>
</template>
