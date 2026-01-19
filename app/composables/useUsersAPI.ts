/**
 * Composable para interactuar con la API de usuarios
 * Implementa el patrón de Nuxt 4 con useFetch para lectura (con caché)
 * y $fetch para mutaciones (sin caché)
 *
 * Usa las rutas semánticas de NestJS:
 * - GET /api/users → listar usuarios
 * - POST /api/users → crear usuario
 * - POST /api/users/:userId/ban → banear usuario
 * - DELETE /api/users/:userId/ban → desbanear usuario
 * - DELETE /api/users/:userId → eliminar usuario
 */

/**
 * Interfaces para DTOs
 */
export interface CreateUserDTO {
  email: string
  password: string
  name: string
  role?: 'user' | 'admin' | 'moderator'
}

export interface UpdateRoleDTO {
  role: 'user' | 'admin' | 'moderator'
}

export interface BanUserDTO {
  banReason?: string
  banExpiresIn?: number
}

export interface UpdateUserDTO {
  name?: string
  email?: string
}

export interface SetPasswordDTO {
  password: string
}

export interface UserResponse {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'moderator'
  banned?: boolean
  banReason?: string
  banExpires?: string
  createdAt: string
}

export interface UsersListResponse {
  users: UserResponse[]
  total?: number
  limit?: number
  offset?: number
}

/**
 * Composable para lectura de usuarios (con caché)
 *
 * Usa useFetch con getCachedData para evitar re-fetching innecesario.
 * Los datos se cachean automáticamente en navegación.
 *
 * @example
 * const { data: users, status, error, refresh } = useUsersList()
 */
export function useUsersList() {
  const { checkPermission } = useRole()
  const { user } = useAuth()

  // Verificar si tiene permiso user:list (admin o moderator)
  const canListUsers = computed(() => checkPermission({ user: ['list'] }))

  const fetchResult = useFetch<UsersListResponse>('/api/users', {
    key: 'users-list',
    method: 'GET',
    // Solo ejecutar si tiene permiso user:list
    immediate: canListUsers.value,
    // Refrescar cuando cambie el permiso (login/logout)
    watch: [canListUsers],
    // Caché personalizada - pero limpiar si no tiene permiso
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
 *
 * Proporciona métodos para crear, actualizar, banear y eliminar usuarios.
 * Todos los métodos requieren rol de administrador.
 * Usa las rutas semánticas de NestJS que internamente llaman a Better Auth.
 *
 * @example
 * const { createUser, updateUserRole } = useUsersMutations()
 * await createUser({ email: 'user@example.com', password: 'pass', name: 'User' })
 */
export function useUsersMutations() {
  const { isAdmin, checkPermission } = useRole()
  const nuxtApp = useNuxtApp()

  /**
   * Invalida la caché de la lista de usuarios para refrescar los datos
   */
  const invalidateUsersCache = () => {
    // Limpiar caché de payload
    delete nuxtApp.payload.data['users-list']
    // Refrescar la lista si el composable está siendo usado
    refreshNuxtData('users-list')
  }

  /**
   * Crea un nuevo usuario
   * Requiere rol de administrador
   */
  const createUser = async (userData: CreateUserDTO): Promise<{ user: UserResponse }> => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    const response = await $fetch<{ user: UserResponse }>('/api/users', {
      method: 'POST',
      body: userData
    })

    // Invalidar caché para refrescar la lista
    invalidateUsersCache()

    return response
  }

  /**
   * Actualiza el rol de un usuario
   * Requiere rol de administrador
   */
  const updateUserRole = async (userId: string, roleData: UpdateRoleDTO): Promise<void> => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await $fetch(`/api/roles/${userId}`, {
      method: 'PUT',
      body: roleData
    })

    // Invalidar caché para refrescar la lista
    invalidateUsersCache()
  }

  /**
   * Banea un usuario
   * Requiere permiso user:ban (admin o moderator)
   */
  const banUser = async (userId: string, banData?: BanUserDTO): Promise<void> => {
    if (!checkPermission({ user: ['ban'] })) {
      throw new Error('No autorizado: Se requiere permiso user:ban')
    }

    await $fetch(`/api/users/${userId}/ban`, {
      method: 'POST',
      body: banData || {}
    })

    // Invalidar caché para refrescar la lista
    invalidateUsersCache()
  }

  /**
   * Desbanea un usuario
   * Requiere permiso user:ban (admin o moderator)
   */
  const unbanUser = async (userId: string): Promise<void> => {
    if (!checkPermission({ user: ['ban'] })) {
      throw new Error('No autorizado: Se requiere permiso user:ban')
    }

    await $fetch(`/api/users/${userId}/ban`, {
      method: 'DELETE'
    })

    // Invalidar caché para refrescar la lista
    invalidateUsersCache()
  }

  /**
   * Elimina un usuario permanentemente
   * Requiere rol de administrador
   */
  const deleteUser = async (userId: string): Promise<void> => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await $fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    })

    // Invalidar caché para refrescar la lista
    invalidateUsersCache()
  }

  /**
   * Actualiza la información básica de un usuario
   * Requiere rol de administrador
   */
  const updateUserDetails = async (userId: string, userData: UpdateUserDTO): Promise<void> => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      body: userData
    })

    invalidateUsersCache()
  }

  /**
   * Cambia la contraseña de un usuario
   * Requiere rol de administrador
   */
  const setUserPassword = async (userId: string, passwordData: SetPasswordDTO): Promise<void> => {
    if (!isAdmin.value) {
      throw new Error('No autorizado: Se requiere rol de administrador')
    }

    await $fetch(`/api/users/${userId}/password`, {
      method: 'POST',
      body: passwordData
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
