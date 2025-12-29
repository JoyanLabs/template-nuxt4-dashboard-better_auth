import { useAuthFetch } from '~/composables/useAuthFetch'
import { authClient } from '~/lib/auth-client'

/**
 * Middleware de autenticación usando Better Auth
 *
 * IMPORTANTE: Usa useAuthFetch en lugar de useFetch para SSR
 * useAuthFetch convierte URLs absolutas a relativas para que las cookies se reenvíen correctamente
 */
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('🛡️ [AUTH MIDDLEWARE] Ejecutándose en ruta:', to.path)

  // Ignorar la página de login para evitar bucles infinitos
  if (to.path === '/login') {
    console.log('✅ [AUTH MIDDLEWARE] Ruta de login - permitiendo acceso sin verificar sesión')
    return
  }

  try {
    // Verificar sesión usando Better Auth con wrapper personalizado
    const { data: session, error } = await authClient.useSession(useAuthFetch)

    console.log('📊 [AUTH MIDDLEWARE] Resultado de verificación:')
    console.log('  - Sesión encontrada:', !!session.value)
    console.log('  - Usuario:', session.value?.user?.email)
    console.log('  - Error:', error.value?.message || 'ninguno')

    // Si hay error o no hay sesión, redirigir al login
    if (error.value || !session.value) {
      console.log('❌ [AUTH MIDDLEWARE] Sin sesión válida - redirigiendo a /login')
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }

    console.log('✅ [AUTH MIDDLEWARE] Sesión válida - permitiendo acceso a', to.path)
  } catch (err) {
    // En caso de error, redirigir al login
    console.error('💥 [AUTH MIDDLEWARE] Error en middleware de autenticación:', err)
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
