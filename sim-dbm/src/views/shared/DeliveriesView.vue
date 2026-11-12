<script setup>
import { computed, ref } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { usePermission } from '@/composables/usePermission'
import DeliveryTable from '@/features/deliveries/DeliveryTable.vue'
import { advanceDeliveryStatus, rescheduleDelivery, scheduleDelivery } from '@/services/deliveries'
import { useCustomersStore } from '@/stores/customers'
import { useDeliveriesStore } from '@/stores/deliveries'
import { useOrdersStore } from '@/stores/orders'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'
import { MESSAGES } from '@/utils/constants'
import { formatDate, todayISO } from '@/utils/date'
import { validateDelivery } from '@/validators/delivery'

const deliveries = useDeliveriesStore()
const orders = useOrdersStore()
const customers = useCustomersStore()
const users = useUsersStore()
const ui = useUiStore()
const { can } = usePermission()

const formOpen = ref(false)
const editing = ref(null)

const sortedRows = computed(() => [...deliveries.rows].sort((a, b) => b.delivery_date.localeCompare(a.delivery_date)))
const courierOptions = computed(() => users.couriers.map((u) => ({ value: u.id, label: u.name })))
// Order yang belum punya jadwal pengiriman (satu order satu pengiriman)
const unscheduledOrders = computed(() => orders.active.filter((o) => !deliveries.byOrder(o.id)))
const orderOptions = computed(() =>
  unscheduledOrders.value.map((o) => ({
    value: o.id,
    label: `${o.order_number} - ${customers.byId(o.customer_id)?.name ?? '-'} (diminta ${formatDate(o.requested_delivery_date)})`
  }))
)

const fields = computed(() => [
  { key: 'order_id', label: 'Order', type: 'select', numeric: true, options: orderOptions.value, disabled: Boolean(editing.value) },
  { key: 'delivery_date', label: 'Tanggal kirim', type: 'date' },
  { key: 'courier_id', label: 'Pengantar', type: 'select', numeric: true, options: courierOptions.value }
])
const initial = computed(() =>
  editing.value
    ? { order_id: editing.value.order_id, delivery_date: editing.value.delivery_date, courier_id: editing.value.courier_id }
    : { order_id: '', delivery_date: todayISO(), courier_id: '' }
)

const validate = (form) =>
  validateDelivery(form, { orderDate: orders.byId(form.order_id)?.order_date ?? null, couriers: users.couriers })

function save(data) {
  if (editing.value) {
    const result = rescheduleDelivery(editing.value.id, data)
    if (!result.ok) return ui.notify(result.message, 'error')
  } else {
    scheduleDelivery(data)
  }
  formOpen.value = false
  ui.notify(MESSAGES.saved)
}

function advance(row) {
  const result = advanceDeliveryStatus(row.id)
  ui.notify(result.ok ? 'Status pengiriman diperbarui.' : result.message, result.ok ? 'success' : 'error')
}
</script>

<template>
  <div>
    <PageHeader title="Pengiriman">
      <BaseButton v-if="can('delivery:schedule')" @click="editing = null; formOpen = true">Jadwalkan pengiriman</BaseButton>
    </PageHeader>
    <section class="card">
      <DeliveryTable
        :rows="sortedRows"
        :can-schedule="can('delivery:schedule')"
        :can-update-status="can('delivery:update_status')"
        @reschedule="editing = $event; formOpen = true"
        @advance="advance"
      />
    </section>
    <FormModal
      :open="formOpen"
      :title="editing ? 'Ubah jadwal pengiriman' : 'Jadwalkan pengiriman'"
      :fields="fields"
      :initial="initial"
      :validate="validate"
      @submit="save"
      @close="formOpen = false"
    />
  </div>
</template>
