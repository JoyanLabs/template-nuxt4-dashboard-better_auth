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

const { banUser } = useUsersMutations()
const toast = useToast()

const banReason = ref('Baneado por administrador')
const isSubmitting = ref(false)

watch(() => props.open, (newOpen) => {
  if (newOpen) {
    banReason.value = 'Baneado por administrador'
  }
})

const handleConfirmBan = async () => {
  if (!props.user) return

  try {
    isSubmitting.value = true
    await banUser(props.user.id as string, { banReason: banReason.value })

    toast.add({
      title: 'Usuario baneado',
      description: `${props.user.name} ha sido baneado del sistema`,
      icon: 'i-lucide-ban',
      color: 'warning'
    })

    isOpen.value = false
    emit('success')
  } catch (error) {
    console.error('Error al banear:', error)
    toast.add({
      title: 'Error',
      description: 'No se pudo banear al usuario',
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
    title="Banear Usuario"
    description="Restringir el acceso al sistema para este usuario."
  >
    <template #body>
      <div class="space-y-4">
        <UAlert
          icon="i-lucide-shield-alert"
          color="warning"
          variant="soft"
          title="Restricción de Acceso"
          description="El usuario no podrá iniciar sesión ni realizar acciones en el sistema hasta que sea desbaneado."
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

        <UFormField label="Motivo del baneo (opcional)">
          <UTextarea
            v-model="banReason"
            placeholder="Ej. Incumplimiento de las normas de la comunidad"
            class="w-full"
            :rows="3"
          />
        </UFormField>
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
          label="Confirmar Baneo"
          color="warning"
          variant="solid"
          :loading="isSubmitting"
          @click="handleConfirmBan"
        />
      </div>
    </template>
  </UModal>
</template>
