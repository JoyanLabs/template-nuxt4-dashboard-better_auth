import { createAuthClient } from 'better-auth/vue'

/**
 * Cliente de Better Auth para el frontend
 * Usa el proxy de Nuxt (/api/auth) para evitar problemas de cross-origin cookies
 * El proxy está configurado en nuxt.config.ts -> routeRules
 *
 * IMPORTANTE: Better Auth requiere una URL completa, no paths relativos
 * Usamos la URL del frontend (4000) para que las cookies queden en el mismo dominio
 */
export const authClient = createAuthClient({
  // URL del frontend - el proxy de Nuxt se encarga de reenviar a localhost:3001
  baseURL: import.meta.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:4000',
  fetchOptions: {
    credentials: 'include'
  }
})

// Exportar métodos comunes para uso directo
export const { signIn, signUp, signOut, useSession } = authClient
