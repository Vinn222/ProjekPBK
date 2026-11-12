<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { ROLE_LABELS } from '@/utils/constants'

defineProps({ rows: { type: Array, required: true } })
defineEmits(['edit', 'delete'])

const columns = [
  { key: 'name', label: 'Nama' },
  { key: 'username', label: 'Username' },
  { key: 'roles', label: 'Role' },
  { key: 'active', label: 'Status' }
]
</script>

<template>
  <DataTable :columns="columns" :rows="rows">
    <template #cell-roles="{ value }">{{ value.map((role) => ROLE_LABELS[role]).join(', ') }}</template>
    <template #cell-active="{ value }"><StatusBadge :label="value ? 'Aktif' : 'Nonaktif'" :variant="value ? 'success' : 'neutral'" /></template>
    <template #actions="{ row }">
      <BaseButton variant="secondary" small @click="$emit('edit', row)">Ubah</BaseButton>
      <BaseButton variant="danger" small @click="$emit('delete', row)">Hapus</BaseButton>
    </template>
  </DataTable>
</template>
