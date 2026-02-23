// =============================================================================
// Nuxt 4 Dashboard Template - Better Auth Client Patterns
// =============================================================================

import { computed } from 'vue'
import { createAuthClient } from 'better-auth/vue'
import { adminClient } from 'better-auth/client/plugins'
import { createAccessControl } from 'better-auth/plugins/access'

// =============================================================================
// CLIENTE DE BETTER AUTH
// =============================================================================

const getBaseURL = () => {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [
    adminClient({
      ac,
      roles
    })
  ]
})

export const { signIn, signUp, signOut, useSession } = authClient

// =============================================================================
// PERMISOS Y ROLES
// =============================================================================

export const statement = {
  user: ['create', 'list', 'set-role', 'ban', 'delete', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
} as const

export const ac = createAccessControl(statement)

export const admin = ac.newRole({
  user: ['create', 'list', 'set-role', 'ban', 'delete', 'get', 'update'],
  session: ['list', 'revoke', 'delete']
})

export const moderator = ac.newRole({
  user: ['list', 'ban'],
  session: ['list']
})

export const user = ac.newRole({
  session: []
})

export const roles = { admin, moderator, user }
export type RoleName = keyof typeof roles

// =============================================================================
// WRAPPER PARA SSR
// =============================================================================

export function useAuthFetch<T>(url: string | Request, options?: any) {
  const urlString = typeof url === 'string' ? url : url.url
  const relativeUrl = urlString.replace(/^https?:\/\/[^/]+/, '')
  return useFetch(relativeUrl, options)
}

// =============================================================================
// COMPOSABLE SSR-SAFE
// =============================================================================

export async function useAuthSSR() {
  const { data: sessionData } = await authClient.useSession(useAuthFetch)
  const user = computed(() => sessionData.value?.user)
  const session = computed(() => sessionData.value?.session)
  const isLoading = computed(() => !sessionData.value)

  return {
    user,
    session,
    isLoading
  }
}

// =============================================================================
// COMPOSABLE PARA ACCIONES
// =============================================================================

export function useAuth() {
  const sessionResponse = authClient.useSession()

  const user = computed(() => sessionResponse.value.data?.user)
  const isLoading = computed(() => sessionResponse.value.isPending)
  const error = computed(() => sessionResponse.value.error?.message || null)

  async function signInWithEmail(email: string, password: string) {
    try {
      const result = await authClient.signIn.email({ email, password })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true, user: result.data?.user }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al iniciar sesión' }
    }
  }

  async function signUpWithEmail(email: string, password: string, name: string) {
    try {
      const result = await authClient.signUp.email({ email, password, name })
      if (result.error) {
        return { success: false, error: result.error.message }
      }
      return { success: true, user: result.data?.user }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al registrarse' }
    }
  }

  async function logout() {
    try {
      await authClient.signOut()
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al cerrar sesión' }
    }
  }

  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    signIn: signInWithEmail,
    signUp: signUpWithEmail,
    signOut: logout
  }
}

// =============================================================================
// COMPOSABLE DE ROLES
// =============================================================================

export function useRole() {
  const { user } = useAuth()
  
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isModerator = computed(() => user.value?.role === 'moderator')
  const currentRole = computed<RoleName>(() => {
    return (user.value?.role as RoleName) || 'user'
  })
  
  const hasRole = (role: RoleName | RoleName[]) => {
    if (!user.value) return false
    const roles = Array.isArray(role) ? role : [role]
    return roles.includes(currentRole.value)
  }

  const checkPermission = (permission: Record<string, string[]>) => {
    if (!user.value) return false
    if (isAdmin.value) return true
    
    const [resource, actions] = Object.entries(permission)[0]
    
    if (resource === 'user' && isModerator.value) {
      return actions.some(action => ['list', 'ban'].includes(action))
    }
    
    return false
  }

  return {
    isAdmin,
    isModerator,
    currentRole,
    hasRole,
    checkPermission
  }
}

// =============================================================================
// MIDDLEWARE GLOBAL
// =============================================================================

// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/login' || to.path === '/signup') {
    return
  }
  
  const { user } = await useAuthSSR()
  
  if (!user.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})

// =============================================================================
// EXPORTS
// =============================================================================
export {
  authClient,
  ac,
  roles,
  useAuthFetch,
  useAuthSSR,
  useAuth,
  useRole
}
export type { RoleName }
