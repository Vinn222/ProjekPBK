<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import FormModal from '@/components/common/FormModal.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import { useCrudDialogs } from '@/composables/useCrudDialogs'
import { emptyUser, userFields } from '@/features/users/fields'
import UserTable from '@/features/users/UserTable.vue'
import { userInUse } from '@/services/integrity'
import { useAuthStore } from '@/stores/auth'
import { resetAllToSeed } from '@/stores/bootstrap'
import { useUiStore } from '@/stores/ui'
import { useUsersStore } from '@/stores/users'
import { MESSAGES } from '@/utils/constants'
import { validateUser } from '@/validators/user'

const users = useUsersStore()
const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()
const dialogs = useCrudDialogs()
const resetOpen = ref(false)

const validate = (form) => validateUser(form, { users: users.items, editingId: dialogs.editing.value?.id ?? null })
const initial = () => (dialogs.editing.value ? { ...dialogs.editing.value, password: '' } : emptyUser())

function save(data) {
  const editing = dialogs.editing.value
  const payload = { ...data, username: data.username.toLowerCase() }
  if (editing) {
    if (!payload.password) delete payload.password
    if (editing.id === auth.userId && (!payload.active || !payload.roles.includes(auth.activeRole))) {
      ui.notify('Akun yang sedang dipakai tidak boleh dinonaktifkan atau dicabut role aktifnya.', 'error', 6000)
      return
    }
    users.update(editing.id, payload)
  } else {
    users.add(payload)
  }
  dialogs.closeForm()
  ui.notify(MESSAGES.saved)
}

function remove() {
  const row = dialogs.deleting.value
  dialogs.cancelDelete()
  if (row.id === auth.userId) return ui.notify('Akun yang sedang dipakai tidak bisa dihapus.', 'error')
  if (userInUse(row.id)) return ui.notify('Pengguna sudah tercatat di transaksi. Nonaktifkan saja lewat menu Ubah.', 'error', 6000)
  users.remove(row.id)
  ui.notify(MESSAGES.deleted)
}

function reset() {
  resetOpen.value = false
  resetAllToSeed()
  router.push({ name: 'login' })
  ui.notify(MESSAGES.seedReset, 'info')
}
</script>

<template>
  <div>
    <PageHeader title="Pengguna">
      <BaseButton variant="secondary" @click="resetOpen = true">Kembalikan ke data contoh</BaseButton>
      <BaseButton @click="dialogs.openCreate()">Tambah pengguna</BaseButton>
    </PageHeader>
    <section class="card"><UserTable :rows="users.items" @edit="dialogs.openEdit" @delete="dialogs.askDelete" /></section>
    <FormModal
      :open="dialogs.formOpen.value"
      :title="dialogs.editing.value ? 'Ubah pengguna' : 'Tambah pengguna'"
      :fields="userFields(Boolean(dialogs.editing.value))"
      :initial="initial()"
      :validate="validate"
      @submit="save"
      @close="dialogs.closeForm()"
    />
    <ConfirmDialog
      :open="Boolean(dialogs.deleting.value)"
      :message="`Hapus pengguna ${dialogs.deleting.value?.name ?? ''}?`"
      @confirm="remove"
      @cancel="dialogs.cancelDelete()"
    />
    <ConfirmDialog
      :open="resetOpen"
      title="Kembalikan data"
      message="Semua data akan dikembalikan ke data contoh dan Anda akan keluar. Lanjutkan?"
      confirm-label="Ya, kembalikan"
      @confirm="reset"
      @cancel="resetOpen = false"
    />
  </div>
</template>
