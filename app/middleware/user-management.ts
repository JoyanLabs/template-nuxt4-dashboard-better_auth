/**
 * Middleware de protección para rutas de gestión de usuarios
 *
 * Verifica que el usuario autenticado tenga permisos para listar usuarios.
 * Permite acceso a: admin, moderator (cualquier rol con user:list)
 *
 * @example
 * // En una página Vue
 * definePageMeta({
 *   middleware: 'user-management'
 * })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { checkPermission, isAdmin } = useRole()

  // Admins siempre tienen acceso
  if (isAdmin.value) {
    return
  }

  // Verificar si tiene permiso user:list
  const hasUserListPermission = checkPermission({ user: ['list'] })

  if (!hasUserListPermission) {
    return navigateTo({
      path: '/',
      query: { error: 'unauthorized', message: 'Acceso denegado: Se requieren permisos de gestión de usuarios' }
    })
  }
})
