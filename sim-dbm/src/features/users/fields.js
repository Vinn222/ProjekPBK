import { ROLE_LABELS } from '@/utils/constants'

export const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

export const userFields = (editing) => [
  { key: 'name', label: 'Nama', type: 'text' },
  { key: 'username', label: 'Username', type: 'text' },
  {
    key: 'password',
    label: 'Kata sandi',
    type: 'password',
    hint: editing ? 'Kosongkan bila tidak ingin mengubah kata sandi.' : 'Minimal 6 karakter.'
  },
  { key: 'roles', label: 'Role (boleh lebih dari satu)', type: 'checkbox-group', options: roleOptions },
  { key: 'active', label: 'Akun aktif', type: 'checkbox' }
]

export const emptyUser = () => ({ name: '', username: '', password: '', roles: [], active: true })
