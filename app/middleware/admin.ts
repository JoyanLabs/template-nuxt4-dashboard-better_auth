import { defineNuxtRouteMiddleware, navigateTo } from '#app'
/**
 * Middleware de protección para rutas de administrador
 *
 * Verifica que el usuario autenticado tenga rol de administrador.
 * Si no es admin, redirige a la página principal con mensaje de error.
 *
 * @example
 * // En una página Vue
 * definePageMeta({
 *   middleware: ['auth', 'admin']
 * })
 */
export default defineNuxtRouteMiddleware(async () => {
  const { isAdmin } = useRole()

  if (!isAdmin.value) {
    return navigateTo({
      path: '/',
      query: { error: 'unauthorized', message: 'Acceso denegado: Se requiere rol de administrador' }
    })
  }
})
