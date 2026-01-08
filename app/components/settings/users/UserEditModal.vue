<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { Member } from '~/types'
import { updateUserSchema, type UpdateUserForm } from '~/utils/user.schema'

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

const { updateUserDetails } = useUsersMutations()
const toast = useToast()

const state = reactive<UpdateUserForm>({
  name: '',
  email: ''
})

const isSubmitting = ref(false)
const formRef = ref()

watch(() => props.user, (newUser) => {
  if (newUser) {
    state.name = newUser.name
    state.email = newUser.email
  }
}, { immediate: true })

const onSubmit = async (event: FormSubmitEvent<UpdateUserForm>) => {
  if (!props.user) return

  try {
    isSubmitting.value = true
    await updateUserDetails(props.user.id as string, event.data)

    toast.add({
      title: 'Usuario actualizado',
      description: `Los datos de ${props.user.name} han sido actualizados.`,
      color: 'success'
    })

    isOpen.value = false
    emit('success')
  } catch (error: unknown) {
    const errorData = error as { data?: { message?: string } }
    const message = errorData.data?.message || 'No se pudo actualizar el usuario'
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
    title="Editar Usuario"
    description="Actualizar información básica del perfil."
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="updateUserSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UAlert
          icon="i-lucide-info"
          color="primary"
          variant="soft"
          title="Actualización de Perfil"
          description="Estos cambios afectarán el acceso y la identidad del usuario en el sistema."
        />

        <UFormField label="Nombre" name="name">
          <UInput
            v-model="state.name"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
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
          label="Guardar cambios"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
