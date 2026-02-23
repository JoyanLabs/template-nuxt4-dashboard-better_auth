import { authClient } from '~/utils/auth-client'
import type { RoleName } from '~/utils/permissions'

/**
 * Composable para gestión de roles y permisos
 *
 * Proporciona utilidades para verificar roles y permisos del usuario actual.
 * Usa el sistema de Access Control de Better Auth para verificaciones granulares.
 *
 * @example
 * const { isAdmin, hasPermission, checkPermission, currentRole } = useRole()
 *
 * // Verificación síncrona (local, rápida para UI)
 * if (checkPermission({ user: ['ban'] })) {
 *   // Mostrar botón de ban
 * }
 *
 * // Verificación asíncrona (servidor, más precisa)
 * if (await hasPermission({ user: ['delete'] })) {
 *   // Puede eliminar usuarios
 * }
 */
export function useRole() {
  const { user } = useAuth()

  /**
   * Verifica si el usuario tiene uno o más roles específicos
   *
   * @param role - Rol o array de roles a verificar
   * @returns true si el usuario tiene alguno de los roles especificados
   *
   * @example
   * hasRole('admin') // Verifica si es admin
   * hasRole(['admin', 'moderator']) // Verifica si es admin O moderator
   */
  const hasRole = (role: RoleName | RoleName[]): boolean => {
    if (!user.value) return false

    const userRole = (user.value.role as RoleName) || 'user'
    const roles = Array.isArray(role) ? role : [role]

    return roles.includes(userRole)
  }

  /**
   * Verifica permisos localmente basado en el rol actual (SÍNCRONO)
   *
   * Usa checkRolePermission de Better Auth para verificar sin llamada al servidor.
   * Ideal para mostrar/ocultar elementos de UI rápidamente.
   *
   * @param permissions - Objeto de permisos { recurso: [acciones] }
   * @returns true si el rol actual tiene los permisos
   *
   * @example
   * if (checkPermission({ user: ['ban'] })) {
   *   // Mostrar botón de ban
   * }
   */
  const checkPermission = (permissions: Record<string, string[]>): boolean => {
    if (!user.value) return false

    const userRole = (user.value.role as RoleName) || 'user'

    try {
      return authClient.admin.checkRolePermission({
        permissions,
        role: userRole
      })
    } catch {
      return false
    }
  }

  /**
   * Verifica permisos en el servidor (ASÍNCRONO)
   *
   * Usa hasPermission de Better Auth para verificación precisa.
   * Ideal para operaciones críticas donde se necesita confirmación del servidor.
   *
   * @param permissions - Objeto de permisos { recurso: [acciones] }
   * @returns Promise<boolean> true si el usuario tiene los permisos
   *
   * @example
   * if (await hasPermission({ user: ['delete'] })) {
   *   await deleteUser(userId)
   * }
   */
  const hasPermission = async (permissions: Record<string, string[]>): Promise<boolean> => {
    if (!user.value) return false

    try {
      const { data, error } = await authClient.admin.hasPermission({
        permissions
      })

      return !!data && !error
    } catch {
      return false
    }
  }

  /**
   * Computed que indica si el usuario es administrador
   */
  const isAdmin = computed(() => hasRole('admin'))

  /**
   * Computed que indica si el usuario es moderador
   */
  const isModerator = computed(() => hasRole('moderator'))

  /**
   * Computed que indica si el usuario tiene rol de usuario regular
   */
  const isUser = computed(() => hasRole('user'))

  /**
   * Computed que retorna el rol actual del usuario
   */
  const currentRole = computed<RoleName>(() => (user.value?.role as RoleName) || 'user')

  /**
   * Verifica si el usuario está baneado
   */
  const isBanned = computed(() => user.value?.banned || false)

  return {
    // Verificación de roles
    hasRole,
    isAdmin,
    isModerator,
    isUser,
    currentRole,
    isBanned,
    // Verificación de permisos
    checkPermission, // Síncrono, para UI
    hasPermission // Asíncrono, para operaciones
  }
}
