/**
 * Sistema de Access Control para Better Auth (Frontend)
 *
 * Define los mismos recursos, acciones y roles que el backend
 * para consistencia en la verificación de permisos.
 *
 * IMPORTANTE: Mantener sincronizado con
 * spp-backend/src/shared/infrastructure/auth/permissions.ts
 */

import { createAccessControl } from 'better-auth/plugins/access'

/**
 * Statements: Define todos los recursos y acciones disponibles.
 * Deben coincidir exactamente con los del backend.
 */
export const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
} as const

/**
 * Access Control instance
 */
export const ac = createAccessControl(statement)

/**
 * Definición de roles con sus permisos
 * Deben coincidir exactamente con los del backend.
 */

/**
 * Admin: Control total sobre todos los recursos
 */
export const admin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
})

/**
 * Moderator: Rol de ejemplo con permisos limitados
 */
export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list']
})

/**
 * User: Sin permisos administrativos
 */
export const user = ac.newRole({
  session: []
})

/**
 * Objeto de roles para pasar al plugin adminClient
 */
export const roles = {
  admin,
  moderator,
  user
}

/**
 * Tipo para los nombres de roles disponibles
 */
export type RoleName = keyof typeof roles
