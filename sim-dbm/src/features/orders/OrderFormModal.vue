<script setup>
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import { CHANNELS } from '@/utils/constants'
import { formatRupiah } from '@/utils/format'
import { validateOrder } from '@/validators/order'
import OrderItemRow from './OrderItemRow.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  order: { type: Object, default: null }, // null = order baru
  initialItems: { type: Array, default: () => [] },
  customers: { type: Array, required: true }, // [{ id, name }]
  products: { type: Array, required: true }, // [{ id, name }]
  findPrice: { type: Function, required: true }, // (customerId, productId, design) -> harga | null
  designsFor: { type: Function, required: true }, // (customerId, productId) -> [design]
  itemsLocked: { type: Boolean, default: false },
  defaults: { type: Object, required: true } // { order_date, channel }
})
const emit = defineEmits(['submit', 'close'])

const form = ref({})
const items = ref([])
const errors = ref({})

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    form.value = props.order
      ? { ...props.order }
      : { customer_id: '', order_date: props.defaults.order_date, requested_delivery_date: '', channel: props.defaults.channel, notes: '' }
    items.value = props.order ? props.initialItems.map((item) => ({ ...item })) : [emptyItem()]
    errors.value = {}
  },
  { immediate: true }
)

const emptyItem = () => ({ product_id: '', packing_design: '', quantity: '', unit_price: null })
const customerOptions = computed(() => props.customers.map((c) => ({ value: c.id, label: c.name })))
const productOptions = computed(() => props.products.map((p) => ({ value: p.id, label: p.name })))
const designOptionsOf = (item) =>
  form.value.customer_id && item.product_id
    ? props.designsFor(form.value.customer_id, item.product_id).map((d) => ({ value: d, label: d }))
    : []

function updateItem(index, value) {
  const price = props.findPrice(form.value.customer_id, value.product_id, value.packing_design)
  items.value[index] = { ...value, unit_price: price }
}

// Ganti hotel: harga ikut hotel baru
watch(() => form.value.customer_id, () => {
  items.value = items.value.map((item) => ({
    ...item,
    unit_price: props.findPrice(form.value.customer_id, item.product_id, item.packing_design)
  }))
})

const total = computed(() =>
  items.value.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (item.unit_price || 0), 0)
)
const itemErrors = (index) => ({
  product_id: errors.value[`items.${index}.product_id`],
  packing_design: errors.value[`items.${index}.packing_design`],
  quantity: errors.value[`items.${index}.quantity`]
})

function submit() {
  errors.value = validateOrder({ ...form.value, items: items.value }, { findPrice: props.findPrice })
  if (Object.keys(errors.value).length) return
  emit('submit', { header: { ...form.value }, items: items.value.map((item) => ({ ...item })) })
}
</script>

<template>
  <BaseModal :open="open" :title="order ? 'Ubah order' : 'Order baru'" wide @close="emit('close')">
    <form novalidate @submit.prevent="submit">
      <div class="detail-grid">
        <BaseSelect v-model="form.customer_id" label="Hotel" :options="customerOptions" :error="errors.customer_id" />
        <BaseSelect v-model="form.channel" label="Saluran order" :options="CHANNELS" :error="errors.channel" />
        <BaseInput v-model="form.order_date" label="Tanggal order" type="date" :error="errors.order_date" />
        <BaseInput v-model="form.requested_delivery_date" label="Tanggal kirim diminta" type="date" :error="errors.requested_delivery_date" />
      </div>
      <BaseInput v-model="form.notes" label="Catatan (opsional)" />

      <h2>Barang</h2>
      <p v-if="itemsLocked" class="text-muted text-small">Barang tidak bisa diubah karena order sudah memiliki pembayaran.</p>
      <OrderItemRow
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :product-options="productOptions"
        :design-options="designOptionsOf(item)"
        :errors="itemErrors(index)"
        :locked="itemsLocked"
        @update:item="updateItem(index, $event)"
        @remove="items.splice(index, 1)"
      />
      <p v-if="errors.items" class="field-error">{{ errors.items }}</p>
      <BaseButton v-if="!itemsLocked" variant="secondary" small @click="items.push(emptyItem())">+ Tambah barang</BaseButton>
      <p><strong>Total: {{ formatRupiah(total) }}</strong></p>

      <div class="modal-actions">
        <BaseButton variant="secondary" @click="emit('close')">Batal</BaseButton>
        <BaseButton type="submit">Simpan order</BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
