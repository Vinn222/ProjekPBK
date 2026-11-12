<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useCrudDialogs } from '@/composables/useCrudDialogs'
import { usePermission } from '@/composables/usePermission'
import { emptyProduct, productFields } from '@/features/products/fields'
import ProductTable from '@/features/products/ProductTable.vue'
import { productInUse } from '@/services/integrity'
import { useProductsStore } from '@/stores/products'
import { useUiStore } from '@/stores/ui'
import { MESSAGES } from '@/utils/constants'
import { validateProduct } from '@/validators/product'

const products = useProductsStore()
const ui = useUiStore()
const { can } = usePermission()
const dialogs = useCrudDialogs()

const validate = (form) => validateProduct(form, { products: products.items, editingId: dialogs.editing.value?.id ?? null })

function save(data) {
  if (dialogs.editing.value) products.update(dialogs.editing.value.id, data)
  else products.add(data)
  dialogs.closeForm()
  ui.notify(MESSAGES.saved)
}

function remove() {
  const row = dialogs.deleting.value
  dialogs.cancelDelete()
  if (productInUse(row.id)) {
    ui.notify('Produk sudah dipakai di order dan tidak bisa dihapus. Nonaktifkan saja lewat menu Ubah.', 'error', 6000)
    return
  }
  products.remove(row.id)
  ui.notify(MESSAGES.deleted)
}
</script>

<template>
  <div>
    <PageHeader title="Produk">
      <BaseButton v-if="can('product:write')" @click="dialogs.openCreate()">Tambah produk</BaseButton>
    </PageHeader>
    <section class="card">
      <ProductTable :rows="products.items" :editable="can('product:write')" @edit="dialogs.openEdit" @delete="dialogs.askDelete" />
    </section>
    <FormModal
      :open="dialogs.formOpen.value"
      :title="dialogs.editing.value ? 'Ubah produk' : 'Tambah produk'"
      :fields="productFields"
      :initial="dialogs.editing.value ?? emptyProduct()"
      :validate="validate"
      @submit="save"
      @close="dialogs.closeForm()"
    />
    <ConfirmDialog
      :open="Boolean(dialogs.deleting.value)"
      :message="`Hapus produk ${dialogs.deleting.value?.name ?? ''}?`"
      @confirm="remove"
      @cancel="dialogs.cancelDelete()"
    />
  </div>
</template>
