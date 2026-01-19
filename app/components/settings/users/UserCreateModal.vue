<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { createUserSchema, type CreateUserForm } from '~/utils/user.schema'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'success': []
}>()

const isOpen = computed({
  get: () => props.open,
  set: value => emit('update:open', value)
})

const { createUser } = useUsersMutations()
const toast = useToast()

const roles = [
  { label: 'Admin', value: 'admin' },
  { label: 'Moderator', value: 'moderator' },
  { label: 'User', value: 'user' }
]

const state = reactive<CreateUserForm>({
  name: '',
  email: '',
  password: '',
  role: 'user'
})

const isSubmitting = ref(false)
const formRef = ref()

const resetForm = () => {
  state.name = ''
  state.email = ''
  state.password = ''
  state.role = 'user'
}

const onSubmit = async (event: FormSubmitEvent<CreateUserForm>) => {
  try {
    isSubmitting.value = true
    await createUser(event.data)
    toast.add({
      title: 'Usuario creado',
      description: `El usuario ${event.data.name} ha sido creado correctamente.`,
      color: 'success'
    })
    resetForm()
    isOpen.value = false
    emit('success')
  } catch (error: unknown) {
    const errorData = error as { data?: { message?: string }, message?: string }
    toast.add({
      title: 'Error',
      description: errorData.data?.message || errorData.message || 'No se pudo crear el usuario',
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
    title="Crear Usuario"
    description="Ingresa los datos para el nuevo usuario del sistema."
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="createUserSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UAlert
          icon="i-lucide-info"
          color="primary"
          variant="soft"
          title="Nuevo Usuario"
          description="Se creará una cuenta activa inmediatamente. Asegúrate de proporcionar un email válido para el acceso."
        />

        <UFormField label="Nombre" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="Ej. Juan Pérez"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="juan@ejemplo.com"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Contraseña" name="password" required>
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Rol" name="role" required>
          <USelect
            v-model="state.role"
            :items="roles"
            value-key="value"
            label-key="label"
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
          label="Crear Usuario"
          color="primary"
          :loading="isSubmitting"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
