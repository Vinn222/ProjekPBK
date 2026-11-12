<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useCrudDialogs } from '@/composables/useCrudDialogs'
import { usePermission } from '@/composables/usePermission'
import CustomerTable from '@/features/customers/CustomerTable.vue'
import { customerFields, emptyCustomer } from '@/features/customers/fields'
import { customerInUse } from '@/services/integrity'
import { useCustomersStore } from '@/stores/customers'
import { useUiStore } from '@/stores/ui'
import { MESSAGES } from '@/utils/constants'
import { validateCustomer } from '@/validators/customer'

const customers = useCustomersStore()
const ui = useUiStore()
const { can } = usePermission()
const dialogs = useCrudDialogs()

const validate = (form) => validateCustomer(form, { customers: customers.items, editingId: dialogs.editing.value?.id ?? null })

function save(data) {
  if (dialogs.editing.value) customers.update(dialogs.editing.value.id, data)
  else customers.add(data)
  dialogs.closeForm()
  ui.notify(MESSAGES.saved)
}

function remove() {
  const row = dialogs.deleting.value
  dialogs.cancelDelete()
  if (customerInUse(row.id)) {
    ui.notify('Hotel sudah memiliki order dan tidak bisa dihapus. Nonaktifkan saja lewat menu Ubah.', 'error', 6000)
    return
  }
  customers.remove(row.id)
  ui.notify(MESSAGES.deleted)
}
</script>

<template>
  <div>
    <PageHeader title="Pelanggan (Hotel)">
      <BaseButton v-if="can('customer:write')" @click="dialogs.openCreate()">Tambah hotel</BaseButton>
    </PageHeader>
    <section class="card">
      <CustomerTable :rows="customers.items" :editable="can('customer:write')" @edit="dialogs.openEdit" @delete="dialogs.askDelete" />
    </section>
    <FormModal
      :open="dialogs.formOpen.value"
      :title="dialogs.editing.value ? 'Ubah hotel' : 'Tambah hotel'"
      :fields="customerFields"
      :initial="dialogs.editing.value ?? emptyCustomer()"
      :validate="validate"
      @submit="save"
      @close="dialogs.closeForm()"
    />
    <ConfirmDialog
      :open="Boolean(dialogs.deleting.value)"
      :message="`Hapus hotel ${dialogs.deleting.value?.name ?? ''}?`"
      @confirm="remove"
      @cancel="dialogs.cancelDelete()"
    />
  </div>
</template>
