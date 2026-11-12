<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import DataTable from '@/components/common/DataTable.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useBillRows } from '@/composables/useBillAccess'
import { usePermission } from '@/composables/usePermission'
import DueStatusBadge from '@/features/bills/DueStatusBadge.vue'
import { exchangeFields } from '@/features/bills/fields'
import { recordExchange } from '@/services/billing'
import { useCustomersStore } from '@/stores/customers'
import { useUiStore } from '@/stores/ui'
import { MESSAGES } from '@/utils/constants'
import { formatDate, todayISO } from '@/utils/date'
import { exchangeDayWarning, validateExchange } from '@/validators/exchange'

const ui = useUiStore()
const { can } = usePermission()
const customers = useCustomersStore()
const rows = useBillRows()

const onlyPending = ref(true)
const filtered = computed(() =>
  rows.value.filter((row) => (onlyPending.value ? row.due_status === 'awaiting_exchange' : true))
)
const editing = ref(null)

const columns = [
  { key: 'customer_name', label: 'Hotel' },
  { key: 'order_number', label: 'No. Order' },
  { key: 'delivery_date', label: 'Tanggal kirim' },
  { key: 'exchange_date', label: 'Tukar faktur' },
  { key: 'due_date', label: 'Jatuh tempo' },
  { key: 'due_status', label: 'Status' }
]

const initial = computed(() => ({ exchange_date: editing.value?.exchange_date ?? todayISO() }))
const validate = (form) => validateExchange(form, { deliveryDate: editing.value?.delivery_date ?? null })
const warningOf = (form) =>
  exchangeDayWarning(form.exchange_date, customers.byId(editing.value?.customer_id)?.exchange_day)

function save(data) {
  const result = recordExchange(editing.value.id, data.exchange_date)
  editing.value = null
  ui.notify(result.ok ? MESSAGES.saved : result.message, result.ok ? 'success' : 'error')
}
</script>

<template>
  <div>
    <PageHeader title="Tukar Faktur" subtitle="Tanda terima faktur (TT) dicatat oleh Admin. Jadwal umum: setiap hari Senin.">
      <BaseButton variant="secondary" @click="onlyPending = !onlyPending">
        {{ onlyPending ? 'Tampilkan semua' : 'Hanya yang belum ditukar' }}
      </BaseButton>
    </PageHeader>
    <section class="card">
      <DataTable :columns="columns" :rows="filtered" empty-text="Tidak ada tagihan menunggu tukar faktur.">
        <template #cell-delivery_date="{ value }">{{ value ? formatDate(value) : 'Belum dijadwalkan' }}</template>
        <template #cell-exchange_date="{ value }">{{ formatDate(value) }}</template>
        <template #cell-due_date="{ value }">{{ formatDate(value) }}</template>
        <template #cell-due_status="{ row }"><DueStatusBadge :status="row.due_status" :days-to-due="row.days_to_due" /></template>
        <template v-if="can('bill:exchange')" #actions="{ row }">
          <BaseButton v-if="row.due_status !== 'paid'" small @click="editing = row">
            {{ row.exchange_date ? 'Ubah tanggal' : 'Catat tukar faktur' }}
          </BaseButton>
        </template>
      </DataTable>
    </section>
    <FormModal
      :open="Boolean(editing)"
      :title="`Tukar faktur ${editing?.order_number ?? ''}`"
      :fields="exchangeFields"
      :initial="initial"
      :validate="validate"
      @submit="save"
      @close="editing = null"
    >
      <template #extra="{ form }">
        <p v-if="warningOf(form)" class="badge badge-warning" style="white-space: normal">{{ warningOf(form) }}</p>
      </template>
    </FormModal>
  </div>
</template>
