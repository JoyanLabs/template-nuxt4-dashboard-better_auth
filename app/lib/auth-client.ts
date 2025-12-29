import { createAuthClient } from 'better-auth/vue'

/**
 * Cliente de autenticación de Better Auth
 *
 * IMPORTANTE: Usa la URL del FRONTEND para que el proxy de Nuxt funcione.
 * El proxy en nuxt.config.ts reenvía /api/auth/** al backend.
 * Esto garantiza que las cookies HTTP-only se establezcan en el dominio correcto.
 *
 * Configuración dinámica:
 * - En desarrollo: http://localhost:4005 (de NUXT_PUBLIC_SITE_URL)
 * - En producción: tu dominio (ej: https://tuapp.com)
 */

// Obtener baseURL de variables de entorno, con fallback para desarrollo
const getBaseURL = () => {
  // En cliente, usar window.location.origin directamente
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }

  // En servidor, usar variable de entorno o fallback
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4005'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include' // Necesario para enviar cookies HTTP-only
  }
})

// Exportar métodos comunes para uso directo
export const { signIn, signUp, signOut, useSession } = authClient
