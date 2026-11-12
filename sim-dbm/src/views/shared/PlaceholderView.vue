<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="page-header">
    <h1>{{ route.meta.title }}</h1>
    <p class="text-muted">Halaman ini sedang dikembangkan.</p>
  </div>
</template>
