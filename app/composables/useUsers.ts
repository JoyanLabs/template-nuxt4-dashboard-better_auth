/**
 * Composable para interactuar con la API de usuarios usando nuxt-open-fetch
 *
 * Implementa el patrón de tipos automáticos desde OpenAPI.
 * Reemplaza a useUsersAPI.ts
 */
import type { ApiRequestBody } from '#open-fetch'

/**
 * Composable para lectura de usuarios (con caché y SSR)
 */
export function useUsersList() {
  const { checkPermission } = useRole()
  const { user } = useAuth()

  // Verificar si tiene permiso user:list (admin o moderator)
  const canListUsers = computed(() => checkPermission({ user: ['list'] }))

  const fetchResult = useApi('/api/users', {
    key: 'users-list',
    // Solo ejecutar si tiene permiso user:list
    immediate: canListUsers.value,
    // Refrescar cuando cambie el permiso (login/logout)
    watch: [canListUsers],
    // Caché personalizada
    getCachedData(key) {
      if (!canListUsers.value) return null
      const nuxtApp = useNuxtApp()
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
  })

  // Limpiar caché cuando el usuario cambia (logout/login)
  watch(() => user.value?.id, () => {
    if (canListUsers.value) {
      fetchResult.refresh()
    }
  })

  return fetchResult
}

/**
 * Composable para mutaciones de usuarios (sin caché)
 * Usa nuxtApp.$api para las llamadas
 */
export function useUsersMutations() {
  const { isAdmin, checkPermission } = useRole()
  const nuxtApp = useNuxtApp()

  /**
   * Invalida la caché de la lista de usuarios
   */
  const invalidateUsersCache = () => {
    // Usar refreshNuxtData es más limpio que manipular payload directamente
    refreshNuxtData('users-list')
  }

  /**
   * Crea un nuevo usuario
   * Requiere rol de administrador
   */
  const createUser = async (body: ApiRequestBody<'UserController_createUser'>) => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    const response = await nuxtApp.$api('/api/users', {
      method: 'POST',
      body
    })

    invalidateUsersCache()
    return response
  }

  /**
   * Actualiza el rol de un usuario
   * Requiere rol de administrador
   */
  const updateUserRole = async (
    userId: string,
    body: ApiRequestBody<'RoleController_setUserRole'>
  ) => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await nuxtApp.$api('/api/roles/{userId}', {
      method: 'PUT',
      path: { userId },
      body
    })

    invalidateUsersCache()
  }

  /**
   * Banea un usuario
   * Requiere permiso user:ban
   */
  const banUser = async (
    userId: string,
    body?: ApiRequestBody<'UserController_banUser'>
  ) => {
    if (!checkPermission({ user: ['ban'] })) {
      throw new Error('No autorizado: Se requiere permiso user:ban')
    }

    await nuxtApp.$api('/api/users/{userId}/ban', {
      method: 'POST',
      path: { userId },
      body: body || {}
    })

    invalidateUsersCache()
  }

  /**
   * Desbanea un usuario
   * Requiere permiso user:ban
   */
  const unbanUser = async (userId: string) => {
    if (!checkPermission({ user: ['ban'] })) {
      throw new Error('No autorizado: Se requiere permiso user:ban')
    }

    await nuxtApp.$api('/api/users/{userId}/ban', {
      method: 'DELETE',
      path: { userId }
    })

    invalidateUsersCache()
  }

  /**
   * Elimina un usuario permanentemente
   * Requiere rol de administrador
   */
  const deleteUser = async (userId: string) => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await nuxtApp.$api('/api/users/{userId}', {
      method: 'DELETE',
      path: { userId }
    })

    invalidateUsersCache()
  }

  /**
   * Actualiza la información básica de un usuario
   * Requiere rol de administrador
   */
  const updateUserDetails = async (
    userId: string,
    body: ApiRequestBody<'UserController_updateUser'>
  ) => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await nuxtApp.$api('/api/users/{userId}', {
      method: 'PATCH',
      path: { userId },
      body
    })

    invalidateUsersCache()
  }

  /**
   * Cambia la contraseña de un usuario
   * Requiere rol de administrador
   */
  const setUserPassword = async (
    userId: string,
    body: ApiRequestBody<'UserController_setPassword'>
  ) => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await nuxtApp.$api('/api/users/{userId}/password', {
      method: 'POST',
      path: { userId },
      body
    })
  }

  return {
    createUser,
    updateUserRole,
    banUser,
    unbanUser,
    deleteUser,
    updateUserDetails,
    setUserPassword,
    invalidateUsersCache
  }
}
