<script setup>
import { computed } from 'vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import { BILL_DUE_STATUS_LABELS, BILL_DUE_STATUS_VARIANTS } from '@/utils/constants'

const props = defineProps({
  status: { type: String, required: true }, // salah satu BILL_DUE_STATUS
  daysToDue: { type: Number, default: null }
})

const label = computed(() => {
  const base = BILL_DUE_STATUS_LABELS[props.status]
  if (props.daysToDue === null) return base
  if (props.status === 'near_due') return `${base} (${props.daysToDue} hari)`
  if (props.status === 'overdue') return `${base} (${Math.abs(props.daysToDue)} hari)`
  return base
})
</script>

<template>
  <StatusBadge :label="label" :variant="BILL_DUE_STATUS_VARIANTS[status]" />
</template>
