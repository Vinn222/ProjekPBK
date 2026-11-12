import { STORAGE_PREFIX } from './constants'

// Pembungkus localStorage yang aman: tidak melempar error bila storage diblokir atau penuh
export function readJSON(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    /* diabaikan */
  }
}

// Hapus semua kunci milik aplikasi ini saja
export function clearAppStorage() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
  } catch {
    /* diabaikan */
  }
}
