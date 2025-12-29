import type { UseFetchOptions } from '#app'

/**
 * Wrapper personalizado de useFetch para Better Auth en SSR
 *
 * PROBLEMA: useFetch con URLs absolutas no reenvía cookies HTTP-only en SSR
 * SOLUCIÓN: Convertir URLs absolutas a rutas relativas para que Nuxt forwarding cookies
 *
 * Referencia: https://github.com/better-auth/better-auth/issues/2175
 */
export function useAuthFetch<T>(url: string | Request, options?: UseFetchOptions<T>) {
  // Si es un objeto Request, extraer la URL
  const urlString = typeof url === 'string' ? url : url.url

  // Convertir URL absoluta a ruta relativa
  // Ejemplo: http://localhost:4005/api/auth/get-session -> /api/auth/get-session
  const relativeUrl = urlString.replace(/^https?:\/\/[^/]+/, '')

  // Llamar a useFetch con la ruta relativa
  return useFetch(relativeUrl, options)
}
