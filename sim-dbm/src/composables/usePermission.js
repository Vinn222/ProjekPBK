import { can as canRole } from '@/config/permissions'
import { useAuthStore } from '@/stores/auth'

// Cek hak akses berdasarkan role aktif pengguna
export function usePermission() {
  const auth = useAuthStore()
  return { can: (permission) => canRole(auth.activeRole, permission) }
}
