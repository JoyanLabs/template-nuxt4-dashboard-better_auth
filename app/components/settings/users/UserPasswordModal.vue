<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Member } from '~/types'
import { setUserPasswordSchema, type SetPasswordForm } from '~/utils/user.schema'

const props = defineProps<{
  open: boolean
  user: Member | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

const { setUserPassword } = useUsersMutations()
const toast = useToast()

const state = reactive<SetPasswordForm>({
  password: ''
})

const isSubmitting = ref(false)
const formRef = ref()

watch(() => props.open, (newOpen) => {
  if (newOpen) {
    state.password = ''
  }
})

const onSubmit = async (event: FormSubmitEvent<SetPasswordForm>) => {
  if (!props.user) return

  try {
    isSubmitting.value = true
    await setUserPassword(props.user.id as string, event.data)

    toast.add({
      title: 'Contraseña actualizada',
      description: `Se ha cambiado la contraseña de ${props.user.name} correctamente.`,
      color: 'success'
    })

    isOpen.value = false
  } catch (error: unknown) {
    const errorData = error as { data?: { message?: string } }
    const message = errorData.data?.message || 'No se pudo cambiar la contraseña'
    toast.add({
      title: 'Error',
      description: message,
      color: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = () => {
  formRef.value?.submit()
}
</script>

<template>
  <UModal
    v-model:open="isOpen"
    title="Cambiar Contraseña"
    description="Establecer una nueva clave de acceso para el usuario."
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="setUserPasswordSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UAlert
          icon="i-lucide-key-round"
          color="primary"
          variant="soft"
          title="Nueva Contraseña"
          description="La contraseña anterior será invalidada inmediatamente. El usuario deberá usar la nueva clave en su próximo inicio de sesión."
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

        <UFormField label="Nueva contraseña" name="password" required>
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>
      </UForm>
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
          label="Actualizar Contraseña"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
