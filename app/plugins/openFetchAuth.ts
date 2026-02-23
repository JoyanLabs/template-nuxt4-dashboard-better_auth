/**
 * Plugin para configurar autenticación en nuxt-open-fetch
 * Asegura que las cookies HTTP-only se envíen con cada request
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Hook global para todas las llamadas de openFetch
  nuxtApp.hook('openFetch:onRequest', (ctx) => {
    // Importante: incluir cookies en las peticiones
    // Esto permite que las cookies HTTP-only de Better Auth se envíen
    ctx.options.credentials = 'include'
  })

  // Hook específico para el cliente 'api'
  nuxtApp.hook('openFetch:onRequest:api', (ctx) => {
    ctx.options.credentials = 'include'
  })
})
