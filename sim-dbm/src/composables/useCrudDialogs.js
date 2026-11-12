import { ref } from 'vue'

// Status dialog form tambah/ubah dan dialog hapus yang dipakai berulang oleh halaman CRUD
export function useCrudDialogs() {
  const formOpen = ref(false)
  const editing = ref(null) // baris yang diubah, null = tambah baru
  const deleting = ref(null) // baris yang akan dihapus

  return {
    formOpen,
    editing,
    deleting,
    openCreate() { editing.value = null; formOpen.value = true },
    openEdit(row) { editing.value = row; formOpen.value = true },
    closeForm() { formOpen.value = false },
    askDelete(row) { deleting.value = row },
    cancelDelete() { deleting.value = null }
  }
}
