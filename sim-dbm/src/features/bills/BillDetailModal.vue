<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import DataTable from '@/components/common/DataTable.vue'
import { PAYMENT_METHODS } from '@/utils/constants'
import { formatDate } from '@/utils/date'
import { formatRupiah, labelOf } from '@/utils/format'
import DueStatusBadge from './DueStatusBadge.vue'

defineProps({
  open: { type: Boolean, default: false },
  bill: { type: Object, default: null }, // baris dari bills store (rows)
  payments: { type: Array, default: () => [] },
  notes: { type: Array, default: () => [] },
  canPay: { type: Boolean, default: false },
  canNote: { type: Boolean, default: false }
})
defineEmits(['close', 'pay', 'note'])

const paymentColumns = [
  { key: 'payment_date', label: 'Tanggal' },
  { key: 'amount', label: 'Jumlah', align: 'right' },
  { key: 'method', label: 'Metode' },
  { key: 'recorded_name', label: 'Dicatat oleh' }
]
const noteColumns = [
  { key: 'note_date', label: 'Tanggal' },
  { key: 'result', label: 'Hasil penagihan' },
  { key: 'promise_date', label: 'Janji bayar' },
  { key: 'noted_name', label: 'Oleh' }
]
</script>

<template>
  <BaseModal :open="open" :title="`Tagihan ${bill?.order_number ?? ''}`" wide @close="$emit('close')">
    <template v-if="bill">
      <dl class="detail-grid">
        <div><dt>Hotel</dt><dd>{{ bill.customer_name }}</dd></div>
        <div><dt>Total</dt><dd>{{ formatRupiah(bill.total) }}</dd></div>
        <div><dt>Terbayar</dt><dd>{{ formatRupiah(bill.paid) }}</dd></div>
        <div><dt>Sisa</dt><dd>{{ formatRupiah(bill.remaining) }}</dd></div>
        <div><dt>Tukar faktur</dt><dd>{{ formatDate(bill.exchange_date) }}</dd></div>
        <div><dt>Jatuh tempo</dt><dd>{{ formatDate(bill.due_date) }}</dd></div>
        <div><dt>Status</dt><dd><DueStatusBadge :status="bill.due_status" :days-to-due="bill.days_to_due" /></dd></div>
      </dl>
      <h2>Riwayat pembayaran</h2>
      <DataTable :columns="paymentColumns" :rows="payments" empty-text="Belum ada pembayaran.">
        <template #cell-payment_date="{ value }">{{ formatDate(value) }}</template>
        <template #cell-amount="{ value }">{{ formatRupiah(value) }}</template>
        <template #cell-method="{ value }">{{ labelOf(PAYMENT_METHODS, value) }}</template>
      </DataTable>
      <h2 style="margin-top: 16px">Catatan penagihan</h2>
      <DataTable :columns="noteColumns" :rows="notes" empty-text="Belum ada catatan penagihan.">
        <template #cell-note_date="{ value }">{{ formatDate(value) }}</template>
        <template #cell-promise_date="{ value }">{{ formatDate(value) }}</template>
      </DataTable>
    </template>
    <template #actions>
      <BaseButton v-if="canNote" variant="secondary" @click="$emit('note')">Tambah catatan</BaseButton>
      <BaseButton v-if="canPay && bill && bill.due_status !== 'paid' && bill.exchange_date" @click="$emit('pay')">Catat pembayaran</BaseButton>
      <BaseButton variant="secondary" @click="$emit('close')">Tutup</BaseButton>
    </template>
  </BaseModal>
</template>
