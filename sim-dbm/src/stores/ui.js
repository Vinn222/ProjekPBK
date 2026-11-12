import { defineStore } from 'pinia'

let toastId = 0

export const useUiStore = defineStore('ui', {
  state: () => ({ toasts: [] }),
  actions: {
    notify(message, type = 'success', duration = 3500) {
      const id = ++toastId
      this.toasts.push({ id, message, type })
      if (duration > 0) setTimeout(() => this.dismiss(id), duration)
    },
    dismiss(id) {
      this.toasts = this.toasts.filter((toast) => toast.id !== id)
    }
  }
})
