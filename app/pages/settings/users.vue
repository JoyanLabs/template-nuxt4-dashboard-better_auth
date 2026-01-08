<script setup lang="ts">
import type { Member } from '~/types'

/**
 * Página de gestión de usuarios del sistema
 *
 * IMPLEMENTACIÓN:
 * - Obtiene lista de usuarios usando useUsersList (con caché)
 * - Permite buscar usuarios por nombre, username o email
 * - Muestra lista de usuarios con sus roles (user, moderator, admin)
 * - Permite banear/desbanear y eliminar usuarios
 * - Protegida con middleware admin
 *
 * PERMISOS:
 * - Esta página requiere rol de administrador (middleware: 'admin')
 * - Solo admins pueden ver y gestionar usuarios
 * - Moderators pueden banear pero no eliminar
 */

// Proteger ruta con middleware basado en permisos
// Permite acceso a admin y moderator (cualquier rol con user:list)
definePageMeta({
  middleware: 'user-management'
})

const { isAdmin } = useRole()

// Obtener lista de usuarios con caché
const { data: usersData, status, error, refresh } = useUsersList()

// Transformar UserResponse a Member para compatibilidad con componente
const users = computed<Member[]>(() => {
  const usersList = usersData.value?.users
  if (!usersList) return []

  return usersList.map(user => ({
    id: user.id,
    name: user.name,
    username: user.email?.split('@')[0] || user.name,
    email: user.email,
    role: user.role,
    banned: user.banned,
    createdAt: user.createdAt,
    avatar: {
      src: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
      alt: user.name
    }
  }))
})

// Búsqueda de usuarios
const q = ref('')

// Búsqueda de usuarios filtrada
const filteredUsers = computed(() => {
  if (!q.value) return users.value

  const searchTerm = q.value.toLowerCase()
  return users.value.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm)
      || user.username.toLowerCase().includes(searchTerm)
      || user.email.toLowerCase().includes(searchTerm)
    )
  })
})

const isModalOpen = ref(false)
</script>

<template>
  <div>
    <!-- Modal de crear usuario -->
    <SettingsUsersUserCreateModal
      v-model:open="isModalOpen"
      @success="refresh"
    />

    <!-- Header con botón de invitar -->
    <UPageCard
      title="Users"
      description="Manage users and their roles."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        label="Crear usuario"
        color="primary"
        icon="i-lucide-user-plus"
        class="w-fit lg:ms-auto"
        :disabled="!isAdmin"
        @click="isModalOpen = true"
      />
    </UPageCard>

    <!-- Mensaje de error si falla la carga -->
    <UAlert
      v-if="error"
      icon="i-lucide-circle-alert"
      color="error"
      variant="soft"
      :title="error.message || 'Error al cargar usuarios'"
      class="mb-4"
    />

    <!-- Lista de usuarios -->
    <UPageCard
      variant="subtle"
      :ui="{
        container: 'p-0 sm:p-0 gap-y-0',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-default'
      }"
    >
      <template #header>
        <UInput
          v-model="q"
          icon="i-lucide-search"
          placeholder="Search users"
          autofocus
          class="w-full"
        />
      </template>

      <!-- Skeleton loader mientras carga -->
      <div v-if="status === 'pending'" class="p-4">
        <USkeleton v-for="i in 3" :key="i" class="h-16 mb-2" />
      </div>

      <!-- Lista de usuarios filtrados -->
      <SettingsUsersList
        v-else
        :users="filteredUsers"
        @refresh="refresh"
      />
    </UPageCard>
  </div>
</template>
