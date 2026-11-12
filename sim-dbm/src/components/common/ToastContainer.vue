<script setup>
import { useUiStore } from '@/stores/ui'
import ToastNotification from './ToastNotification.vue'

const ui = useUiStore()
</script>

<template>
  <div class="toast-container">
    <ToastNotification
      v-for="toast in ui.toasts"
      :key="toast.id"
      :message="toast.message"
      :type="toast.type"
      @dismiss="ui.dismiss(toast.id)"
    />
  </div>
</template>
