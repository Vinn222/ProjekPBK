<script setup>
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useCrudDialogs } from '@/composables/useCrudDialogs'
import { usePermission } from '@/composables/usePermission'
import PriceTable from '@/features/prices/PriceTable.vue'
import { useCustomerPricesStore } from '@/stores/customerPrices'
import { useCustomersStore } from '@/stores/customers'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { MESSAGES } from '@/utils/constants'
import { validatePrice } from '@/validators/price'

const prices = useCustomerPricesStore()
const customers = useCustomersStore()
const products = useProductsStore()
const ui = useUiStore()
const { can } = usePermission()
const dialogs = useCrudDialogs()

const customerId = ref(customers.items[0]?.id ?? '')
watch(customerId, (value) => { customerId.value = value === '' ? '' : Number(value) })

const customerOptions = computed(() => customers.items.map((c) => ({ value: c.id, label: c.name })))
const rows = computed(() =>
  prices.byCustomer(customerId.value).map((price) => ({
    ...price,
    product_name: products.byId(price.product_id)?.name ?? '-'
  }))
)
const fields = computed(() => [
  { key: 'product_id', label: 'Produk', type: 'select', numeric: true, options: products.active.map((p) => ({ value: p.id, label: p.name })) },
  { key: 'packing_design', label: 'Desain packing', type: 'text', hint: 'Contoh: Polos, atau nama desain khusus hotel.' },
  { key: 'unit_price', label: 'Harga per pcs (Rp)', type: 'number' }
])
const initial = computed(() => dialogs.editing.value ?? { product_id: '', packing_design: '', unit_price: '' })

const validate = (form) =>
  validatePrice(form, { prices: prices.byCustomer(customerId.value), editingId: dialogs.editing.value?.id ?? null })

function save(data) {
  if (dialogs.editing.value) prices.update(dialogs.editing.value.id, data)
  else prices.add({ ...data, customer_id: customerId.value })
  dialogs.closeForm()
  ui.notify(MESSAGES.saved)
}

function remove() {
  prices.remove(dialogs.deleting.value.id)
  dialogs.cancelDelete()
  ui.notify(MESSAGES.deleted)
}
</script>

<template>
  <div>
    <PageHeader title="Harga Pelanggan" subtitle="Harga berbeda per hotel dan desain packing.">
      <BaseButton v-if="can('price:write') && customerId" @click="dialogs.openCreate()">Tambah harga</BaseButton>
    </PageHeader>
    <section class="card stack">
      <BaseSelect v-model="customerId" label="Hotel" :options="customerOptions" />
      <PriceTable :rows="rows" :editable="can('price:write')" @edit="dialogs.openEdit" @delete="dialogs.askDelete" />
    </section>
    <FormModal
      :open="dialogs.formOpen.value"
      :title="dialogs.editing.value ? 'Ubah harga' : 'Tambah harga'"
      :fields="fields"
      :initial="initial"
      :validate="validate"
      @submit="save"
      @close="dialogs.closeForm()"
    />
    <ConfirmDialog
      :open="Boolean(dialogs.deleting.value)"
      message="Hapus harga ini? Order lama tidak berubah karena harga tersimpan di setiap order."
      @confirm="remove"
      @cancel="dialogs.cancelDelete()"
    />
  </div>
</template>
