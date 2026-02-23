<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Member } from '~/types'
import type { RoleName } from '~/utils/permissions'

defineProps<{
  users: Member[]
}>()

const emit = defineEmits<{
  refresh: []
}>()

const toast = useToast()
const { isAdmin, checkPermission } = useRole()
const { updateUserRole, unbanUser } = useUsersMutations()

const isDeleteModalOpen = ref(false)
const userToDelete = ref<Member | null>(null)

const isBanModalOpen = ref(false)
const userToBan = ref<Member | null>(null)

const isUpdateModalOpen = ref(false)
const userToUpdate = ref<Member | null>(null)

const isPasswordModalOpen = ref(false)
const userForPassword = ref<Member | null>(null)

// Roles disponibles para el selector
const availableRoles: { value: RoleName, label: string }[] = [
  { value: 'user', label: 'Usuario' },
  { value: 'moderator', label: 'Moderador' },
  { value: 'admin', label: 'Administrador' }
]

/**
 * Maneja el cambio de rol de un usuario
 */
const handleRoleChange = async (user: Member, newRole: RoleName) => {
  if (!isAdmin.value) return

  try {
    await updateUserRole(user.id as string, { role: newRole })
    toast.add({
      title: 'Rol actualizado',
      description: `${user.name} ahora es ${newRole}`,
      icon: 'i-lucide-check-circle',
      color: 'success'
    })
    emit('refresh')
  } catch (error) {
    console.error('Error al cambiar rol:', error)
    toast.add({
      title: 'Error',
      description: 'No se pudo actualizar el rol',
      icon: 'i-lucide-circle-x',
      color: 'error'
    })
  }
}

/**
 * Maneja el baneo/desbaneo de un usuario
 */
const handleBanToggle = async (user: Member) => {
  if (!checkPermission({ user: ['ban'] })) {
    toast.add({
      title: 'Sin permisos',
      description: 'No tienes permisos para banear usuarios',
      icon: 'i-lucide-shield-alert',
      color: 'warning'
    })
    return
  }

  if (user.banned) {
    try {
      await unbanUser(user.id as string)
      toast.add({
        title: 'Usuario desbaneado',
        description: `${user.name} ha sido desbaneado`,
        icon: 'i-lucide-check-circle',
        color: 'success'
      })
      emit('refresh')
    } catch (error) {
      console.error('Error al desbanear:', error)
      toast.add({
        title: 'Error',
        description: 'No se pudo desbanear al usuario',
        icon: 'i-lucide-circle-x',
        color: 'error'
      })
    }
  } else {
    userToBan.value = user
    isBanModalOpen.value = true
  }
}

/**
 * Abre el modal de confirmación para eliminar un usuario
 */
const handleOpenDeleteModal = (user: Member) => {
  if (!checkPermission({ user: ['delete'] })) {
    toast.add({
      title: 'Sin permisos',
      description: 'No tienes permisos para eliminar usuarios',
      icon: 'i-lucide-shield-alert',
      color: 'warning'
    })
    return
  }

  userToDelete.value = user
  isDeleteModalOpen.value = true
}

/**
 * Maneja la apertura del modal de edición
 */
const handleOpenUpdateModal = (user: Member) => {
  if (!isAdmin.value) return
  userToUpdate.value = user
  isUpdateModalOpen.value = true
}

/**
 * Maneja la apertura del modal de contraseña
 */
const handleOpenPasswordModal = (user: Member) => {
  if (!isAdmin.value) return
  userForPassword.value = user
  isPasswordModalOpen.value = true
}

/**
 * Genera items del dropdown según el usuario
 */
const getDropdownItems = (user: Member): DropdownMenuItem[] => {
  const items: DropdownMenuItem[] = []

  if (checkPermission({ user: ['ban'] })) {
    items.push({
      label: user.banned ? 'Desbanear usuario' : 'Banear usuario',
      icon: user.banned ? 'i-lucide-check-circle' : 'i-lucide-ban',
      color: user.banned ? 'success' as const : 'warning' as const,
      onSelect: () => handleBanToggle(user)
    })
  }

  if (checkPermission({ user: ['delete'] })) {
    items.push({
      label: 'Editar detalles',
      icon: 'i-lucide-user-cog',
      onSelect: () => handleOpenUpdateModal(user)
    })

    items.push({
      label: 'Cambiar contraseña',
      icon: 'i-lucide-key-round',
      color: 'primary' as const,
      onSelect: () => handleOpenPasswordModal(user)
    })

    items.push({
      label: 'Eliminar usuario',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => handleOpenDeleteModal(user)
    })
  }

  return items
}
</script>

<template>
  <ul role="list" class="divide-y divide-default">
    <li v-if="users.length === 0" class="py-8 px-4 sm:px-6 text-center">
      <p class="text-muted">
        No se encontraron usuarios
      </p>
    </li>

    <li
      v-for="(user, index) in users"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-4 sm:px-6"
      :class="{ 'opacity-50': user.banned }"
    >
      <div class="flex items-center gap-3 min-w-0">
        <UAvatar v-bind="user.avatar" size="md" />
        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate flex items-center gap-2">
            {{ user.name }}
            <UBadge
              v-if="user.banned"
              color="error"
              variant="subtle"
              size="xs"
            >
              Baneado
            </UBadge>
          </p>
          <p class="text-muted truncate">
            {{ user.email || user.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <USelect
          :model-value="user.role"
          :items="availableRoles"
          value-key="value"
          label-key="label"
          color="neutral"
          :ui="{ value: 'capitalize', item: 'capitalize' }"
          :disabled="!isAdmin"
          @update:model-value="newRole => handleRoleChange(user, newRole as RoleName)"
        />

        <UDropdownMenu
          v-if="getDropdownItems(user).length > 0"
          :items="getDropdownItems(user)"
          :content="{ align: 'end' }"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </div>
    </li>
  </ul>

  <!-- Modales extraídos -->
  <SettingsUsersUserEditModal
    v-model:open="isUpdateModalOpen"
    :user="userToUpdate"
    @success="emit('refresh')"
  />

  <SettingsUsersUserPasswordModal
    v-model:open="isPasswordModalOpen"
    :user="userForPassword"
  />

  <SettingsUsersUserDeleteModal
    v-model:open="isDeleteModalOpen"
    :user="userToDelete"
    @success="emit('refresh')"
  />

  <SettingsUsersUserBanModal
    v-model:open="isBanModalOpen"
    :user="userToBan"
    @success="emit('refresh')"
  />
</template>
