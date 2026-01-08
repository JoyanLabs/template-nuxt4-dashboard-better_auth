import { useAuthFetch } from '~/composables/useAuthFetch'
import { authClient } from '~/lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  role?: 'user' | 'admin' // Rol del usuario en Better Auth
  banned?: boolean // Estado de baneo
  createdAt?: Date | string // Fecha de creación (Better Auth devuelve Date)
  updatedAt?: Date | string // Fecha de actualización
  emailVerified?: boolean // Email verificado
  image?: string | null // Avatar/Imagen del usuario
  [key: string]: unknown
}

/**
 * Composable de autenticación para páginas con SSR
 * Usa useSession con useAuthFetch para mantener la sesión en hard refreshes
 *
 * IMPORTANTE: useAuthFetch convierte URLs absolutas a relativas para SSR
 */
export async function useAuthSSR() {
  const { data: sessionData } = await authClient.useSession(useAuthFetch)
  const user = computed(() => sessionData.value?.user)
  const session = computed(() => sessionData.value?.session)
  const isLoading = computed(() => !sessionData.value)
  const error = computed(() => null) // useSession maneja errores internamente

  return {
    user,
    session,
    isLoading,
    error
  }
}

/**
 * Composable de autenticación para componentes
 * Proporciona acceso a las funciones de autenticación de Better Auth
 *
 * ⚠️  ADVERTENCIA: Este composable NO funciona correctamente en páginas con SSR
 * Para páginas con SSR, usa useAuthSSR() en su lugar
 */
export function useAuth() {
  // ⚠️  ADVERTENCIA: No uses este composable en páginas con SSR
  // Puede causar problemas de hidratación y pérdida de sesión
  const sessionResponse = authClient.useSession()

  const user = computed(() => sessionResponse.value.data?.user as User | null)
  const session = computed(() => sessionResponse.value.data?.session)
  const isLoading = computed(() => sessionResponse.value.isPending)
  const error = computed(() => sessionResponse.value.error?.message || null)

  /**
   * Inicia sesión con email y contraseña
   */
  async function signIn(email: string, password: string) {
    try {
      const result = await authClient.signIn.email({
        email,
        password
      })

      if (result.error) {
        return { success: false, error: result.error.message || 'Error al iniciar sesión' }
      }

      return { success: true, user: result.data?.user }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      return { success: false, error: message }
    }
  }

  /**
   * Registra un nuevo usuario
   */
  async function signUp(email: string, password: string, name: string) {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name
      })

      if (result.error) {
        return { success: false, error: result.error.message || 'Error al registrarse' }
      }

      return { success: true, user: result.data?.user }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al registrarse'
      return { success: false, error: message }
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async function signOut() {
    try {
      await authClient.signOut()
      return { success: true }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión'
      return { success: false, error: message }
    }
  }

  /**
   * Verifica si el usuario está autenticado
   */
  const isAuthenticated = computed(() => !!user.value)

  return {
    user,
    session,
    isLoading,
    error,
    isAuthenticated,
    signIn,
    signUp,
    signOut
  }
}
