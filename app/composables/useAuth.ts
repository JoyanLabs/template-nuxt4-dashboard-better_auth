import { authClient } from '~/lib/auth-client'

interface User {
  id: string
  email: string
  name: string
  [key: string]: unknown
}

/**
 * Composable de autenticación
 * Proporciona acceso a las funciones de autenticación de Better Auth
 * y gestiona el estado del usuario usando el cliente oficial
 */
export function useAuth() {
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
