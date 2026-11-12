<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useBillRows } from '@/composables/useBillAccess'
import { usePermission } from '@/composables/usePermission'
import BillDetailModal from '@/features/bills/BillDetailModal.vue'
import BillTable from '@/features/bills/BillTable.vue'
import { noteFields, paymentFields } from '@/features/bills/fields'
import { addCollectionNote, recordPayment } from '@/services/billing'
import { useAuthStore } from '@/stores/auth'
import { useCollectionNotesStore } from '@/stores/collectionNotes'
import { usePaymentsStore } from '@/stores/payments'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'
import { BILL_DUE_STATUS_LABELS, MESSAGES } from '@/utils/constants'
import { todayISO } from '@/utils/date'
import { validateNote } from '@/validators/note'
import { validatePayment } from '@/validators/payment'

const auth = useAuthStore()
const ui = useUiStore()
const { can } = usePermission()
const payments = usePaymentsStore()
const notes = useCollectionNotesStore()
const users = useUsersStore()
const rows = useBillRows()

const statusFilter = ref('')
const statusOptions = Object.entries(BILL_DUE_STATUS_LABELS).map(([value, label]) => ({ value, label }))
const filtered = computed(() => rows.value.filter((row) => !statusFilter.value || row.due_status === statusFilter.value))

const selectedId = ref(null)
const selected = computed(() => rows.value.find((row) => row.id === selectedId.value) ?? null)
const payOpen = ref(false)
const noteOpen = ref(false)
const payFromTable = ref(false) // bayar langsung dari tabel: tutup juga detail setelah selesai

const nameOf = (id) => users.byId(id)?.name ?? '-'
const paymentRows = computed(() =>
  selected.value ? payments.byBill(selected.value.id).map((p) => ({ ...p, recorded_name: nameOf(p.recorded_by) })) : []
)
const noteRows = computed(() =>
  selected.value ? notes.byBill(selected.value.id).map((n) => ({ ...n, noted_name: nameOf(n.noted_by) })) : []
)

function openPay(row) { selectedId.value = row.id; payFromTable.value = true; payOpen.value = true }
function closePay() {
  payOpen.value = false
  if (payFromTable.value) selectedId.value = null
  payFromTable.value = false
}

const payInitial = computed(() => ({ payment_date: todayISO(), amount: selected.value?.remaining ?? '', method: '', notes: '' }))
const validatePay = (form) =>
  validatePayment(form, { remaining: selected.value?.remaining ?? 0, exchangeDate: selected.value?.exchange_date ?? null, today: todayISO() })

function savePayment(data) {
  recordPayment(selected.value.id, data, auth.userId)
  closePay()
  ui.notify('Pembayaran dicatat.')
}

function saveNote(data) {
  addCollectionNote(selected.value.id, data, auth.userId)
  noteOpen.value = false
  ui.notify(MESSAGES.saved)
}
</script>

<template>
  <div>
    <PageHeader title="Tagihan" subtitle="Jatuh tempo = tanggal tukar faktur + 14 hari." />
    <section class="card">
      <div class="filter-bar">
        <BaseSelect v-model="statusFilter" label="Status" :options="statusOptions" placeholder="Semua" />
        <BaseButton variant="secondary" small @click="statusFilter = ''">Reset filter</BaseButton>
      </div>
      <BillTable :rows="filtered" :can-pay="can('payment:create')" @detail="selectedId = $event.id" @pay="openPay" />
    </section>
    <BillDetailModal
      :open="Boolean(selected) && !payOpen && !noteOpen"
      :bill="selected"
      :payments="paymentRows"
      :notes="noteRows"
      :can-pay="can('payment:create')"
      :can-note="can('note:create')"
      @close="selectedId = null"
      @pay="payFromTable = false; payOpen = true"
      @note="noteOpen = true"
    />
    <FormModal
      :open="payOpen"
      title="Catat pembayaran"
      :fields="paymentFields"
      :initial="payInitial"
      :validate="validatePay"
      @submit="savePayment"
      @close="closePay"
    />
    <FormModal
      :open="noteOpen"
      title="Catatan penagihan"
      :fields="noteFields"
      :initial="{ note_date: todayISO(), result: '', promise_date: '' }"
      :validate="validateNote"
      @submit="saveNote"
      @close="noteOpen = false"
    />
  </div>
</template>
