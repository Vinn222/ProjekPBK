<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <div class="page-header row" style="justify-content: space-between">
    <div>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="text-muted" style="margin: 0">{{ subtitle }}</p>
    </div>
    <div class="row"><slot /></div>
  </div>
</template>
