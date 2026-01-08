import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'
import { ac, roles } from '~/lib/permissions'

/**
 * Cliente de autenticación de Better Auth
 *
 * IMPORTANTE: Usa la URL del FRONTEND para que el proxy de Nuxt funcione.
 * El proxy en nuxt.config.ts reenvía /api/auth/** al backend.
 * Esto garantiza que las cookies HTTP-only se establezcan en el dominio correcto.
 *
 * Configuración dinámica:
 * - En desarrollo: http://localhost:3000 (de NUXT_PUBLIC_SITE_URL)
 * - En producción: tu dominio (ej: https://tuapp.com)
 */

// Obtener baseURL de variables de entorno, con fallback para desarrollo
const getBaseURL = () => {
  // En cliente, usar window.location.origin directamente
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }

  // En servidor, usar variable de entorno o fallback
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include' // Necesario para enviar cookies HTTP-only
  },
  plugins: [
    // Plugin de admin con Access Control configurado
    adminClient({
      ac,
      roles
    })
  ]
})

// Exportar métodos comunes para uso directo
export const { signIn, signUp, signOut, useSession } = authClient

/**
 * Métodos de admin disponibles:
 * - authClient.admin.listUsers()
 * - authClient.admin.createUser()
 * - authClient.admin.banUser()
 * - authClient.admin.hasPermission({ permissions })
 * - authClient.admin.checkRolePermission({ permissions, role })
 */
