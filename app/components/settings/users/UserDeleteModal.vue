<script setup lang="ts">
import type { Member } from '~/types'

const props = defineProps<{
  open: boolean
  user: Member | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

const { deleteUser } = useUsersMutations()
const toast = useToast()

const isSubmitting = ref(false)

const handleConfirmDelete = async () => {
  if (!props.user) return

  try {
    isSubmitting.value = true
    await deleteUser(props.user.id as string)

    toast.add({
      title: 'Usuario eliminado',
      description: `${props.user.name} ha sido eliminado permanentemente`,
      icon: 'i-lucide-trash-2',
      color: 'success'
    })

    isOpen.value = false
    emit('success')
  } catch (error) {
    console.error('Error al eliminar:', error)
    toast.add({
      title: 'Error',
      description: 'No se pudo eliminar el usuario',
      icon: 'i-lucide-circle-x',
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Eliminar usuario"
    description="¿Estás seguro de que deseas eliminar permanentemente a este usuario?"
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          icon="i-lucide-circle-alert"
          color="error"
          variant="soft"
          title="Acción irreversible"
          description="Al eliminar este usuario, se perderán todos sus datos y accesos de forma permanente."
        />

        <div v-if="user" class="flex items-center gap-3 p-3 rounded-lg border border-default bg-subtle">
          <UAvatar v-bind="user.avatar" size="md" />
          <div class="text-sm min-w-0">
            <p class="text-highlighted font-medium truncate">
              {{ user.name }}
            </p>
            <p class="text-muted truncate">
              {{ user.email || user.username }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancelar"
          color="neutral"
          variant="ghost"
          @click="isOpen = false"
        />
        <UButton
          label="Eliminar Permanentemente"
          color="error"
          variant="solid"
          :loading="isSubmitting"
          @click="handleConfirmDelete"
        />
      </div>
    </template>
  </UModal>
</template>
