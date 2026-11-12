import { defineStore } from 'pinia'
import { STORAGE_PREFIX } from '@/utils/constants'
import { readJSON, writeJSON, removeKey } from '@/utils/storage'

// Pabrik store koleksi: data dimuat dari localStorage; bila kosong disalin dari seed JSON.
// Setiap perubahan state otomatis disimpan kembali ke localStorage ($subscribe).
export function defineCollectionStore(name, seed, extras = {}) {
  const storageKey = `${STORAGE_PREFIX}${name}`

  return defineStore(name, {
    state: () => ({ items: [], loaded: false }),
    getters: {
      byId: (state) => (id) => state.items.find((item) => item.id === Number(id)) ?? null,
      nextId: (state) => state.items.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      ...extras.getters
    },
    actions: {
      load() {
        if (this.loaded) return
        const stored = readJSON(storageKey)
        if (Array.isArray(stored)) {
          this.items = stored
        } else {
          this.items = structuredClone(seed)
          writeJSON(storageKey, this.items)
        }
        this.loaded = true
        this.$subscribe(() => writeJSON(storageKey, this.items), { detached: true, flush: 'sync' })
      },
      add(data) {
        const item = { ...data, id: this.nextId }
        this.items.push(item)
        return item
      },
      update(id, changes) {
        const item = this.items.find((entry) => entry.id === Number(id))
        if (!item) return null
        Object.assign(item, changes)
        return item
      },
      remove(id) {
        const index = this.items.findIndex((entry) => entry.id === Number(id))
        if (index === -1) return false
        this.items.splice(index, 1)
        return true
      },
      resetToSeed() {
        this.items = structuredClone(seed)
        writeJSON(storageKey, this.items)
      },
      ...extras.actions
    }
  })
}

export function clearCollectionKey(name) {
  removeKey(`${STORAGE_PREFIX}${name}`)
}
