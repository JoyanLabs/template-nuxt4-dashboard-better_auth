import { authClient } from '~/lib/auth-client'

/**
 * Middleware de autenticación usando Better Auth
 * Siguiendo el patrón oficial de la documentación:
 * https://www.better-auth.com/docs/integrations/nuxt#middleware
 *
 * Usa authClient.useSession(useFetch) para SSR
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Ignorar la página de login para evitar bucles infinitos
  if (to.path === '/login') {
    return
  }

  // Patrón oficial de Better Auth para Nuxt middleware
  // useFetch permite que funcione tanto en SSR como en cliente
  const { data: session } = await authClient.useSession(useFetch)

  if (!session.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
