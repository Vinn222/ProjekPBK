<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import { homePathOf } from '@/router'
import { useAuthStore } from '@/stores/auth'
import { MESSAGES } from '@/utils/constants'

const auth = useAuthStore()
const router = useRouter()
</script>

<template>
  <div class="card stack">
    <h2>Akses ditolak</h2>
    <p>{{ MESSAGES.forbidden }}</p>
    <BaseButton @click="router.push(homePathOf(auth.activeRole))">Kembali ke dashboard</BaseButton>
  </div>
</template>
