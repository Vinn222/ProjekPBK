import { ROLES } from '@/utils/constants'

// Matriks hak akses per role (dasar pemetaan tabel 1.4 dan 2.2).
// Komponen dan halaman memeriksa hak lewat can(role, permission), bukan membandingkan nama role.
const PERMISSIONS = {
  [ROLES.DIREKTUR]: [
    'customer:read', 'customer:write',
    'product:read', 'product:write',
    'price:read', 'price:write',
    'order:read', 'order:create', 'order:update', 'order:delete',
    'delivery:read', 'delivery:schedule',
    'bill:read',
    'report:read',
    'user:manage'
  ],
  [ROLES.ADMIN]: [
    'customer:read', 'customer:write',
    'product:read', 'product:write',
    'price:read', 'price:write',
    'order:read', 'order:update', 'order:delete', // Admin tidak membuat order
    'delivery:read', 'delivery:schedule', 'delivery:update_status',
    'bill:read', 'bill:exchange', 'payment:create', 'note:create',
    'report:read'
  ],
  [ROLES.MARKETING]: [
    'customer:read',
    'product:read',
    'price:read',
    'order:read', 'order:create', 'order:update',
    'bill:read', 'note:create'
  ],
  [ROLES.COURIER]: ['delivery:read', 'delivery:update_status']
}

export function can(role, permission) {
  return PERMISSIONS[role]?.includes(permission) ?? false
}
