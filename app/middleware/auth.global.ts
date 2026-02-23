import { defineNuxtRouteMiddleware, navigateTo } from '#app'
import { useAuthFetch } from '~/composables/useAuthFetch'
import { authClient } from '~/utils/auth-client'

/**
 * Middleware de autenticación usando Better Auth
 *
 * IMPORTANTE: Usa useAuthFetch en lugar de useFetch para SSR
 * useAuthFetch convierte URLs absolutas a relativas para que las cookies se reenvíen correctamente
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Ignorar la página de login para evitar bucles infinitos
  if (to.path === '/login') {
    return
  }

  try {
    // Verificar sesión usando Better Auth con wrapper personalizado
    const { data: session, error } = await authClient.useSession(useAuthFetch)

    // Si hay error o no hay sesión, redirigir al login
    if (error.value || !session.value) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } catch (err) {
    // En caso de error, redirigir al login
    console.error('Error en middleware de autenticación:', err)
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
