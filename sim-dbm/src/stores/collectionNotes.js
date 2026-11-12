import seed from '@/seed/collection_notes.json'
import { defineCollectionStore } from './collection'

export const useCollectionNotesStore = defineCollectionStore('collection_notes', seed, {
  getters: {
    byBill: (state) => (billId) =>
      state.items
        .filter((note) => note.bill_id === Number(billId))
        .sort((a, b) => b.note_date.localeCompare(a.note_date))
  }
})
