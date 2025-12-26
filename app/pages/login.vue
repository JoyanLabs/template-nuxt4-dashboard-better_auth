<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UPageCard class="w-full max-w-md">
      <template #header>
        <h2 class="text-2xl font-bold text-center">
          {{ isSignUp ? 'Crear cuenta' : 'Iniciar sesión' }}
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
          {{ isSignUp ? 'Regístrate para comenzar' : 'Ingresa tus credenciales' }}
        </p>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="handleSubmit"
      >
        <template v-if="isSignUp">
          <UFormField label="Nombre" name="name">
            <UInput
              v-model="state.name"
              placeholder="Tu nombre"
            />
          </UFormField>
        </template>

        <UFormField label="Email" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="tu@email.com"
          />
        </UFormField>

        <UFormField label="Contraseña" name="password">
          <UInput
            v-model="state.password"
            type="password"
            placeholder="••••••••"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
        >
          {{ isSignUp ? 'Registrarse' : 'Iniciar sesión' }}
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-center">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
            <UButton
              variant="link"
              class="p-0 h-auto text-sm"
              @click="toggleMode"
            >
              {{ isSignUp ? 'Inicia sesión' : 'Regístrate' }}
            </UButton>
          </span>
        </div>

        <UAlert
          v-if="error"
          icon="i-lucide-circle-alert"
          color="error"
          variant="soft"
          :title="Array.isArray(error) ? error.join('\n') : error"
          class="mt-4"
        />
      </template>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: false
})

const { signIn, signUp } = useAuth()

// Estado del formulario
const isSignUp = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Estado del formulario reactivo
const state = reactive({
  name: '',
  email: '',
  password: ''
})

// Esquemas de validación
const loginSchema = z.object({
  email: z.string().email('El email debe tener un formato válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es requerido'),
  email: z.string().email('El email debe tener un formato válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres')
})

const schema = computed(() => isSignUp.value ? registerSchema : loginSchema)

// Toggle entre login y registro
function toggleMode() {
  isSignUp.value = !isSignUp.value
  error.value = null
  // Limpiar el estado del formulario
  state.name = ''
  state.email = ''
  state.password = ''
}

// Manejar el envío del formulario
async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    let result

    if (isSignUp.value) {
      result = await signUp(
        state.email,
        state.password,
        state.name
      )
    } else {
      result = await signIn(
        state.email,
        state.password
      )
    }

    if (result.success) {
      // Obtener redirect de query params o usar '/' por defecto
      const route = useRoute()
      const redirectTo = (route.query.redirect as string) || '/'
      await navigateTo(redirectTo)
    } else {
      error.value = result.error || 'Error al procesar la solicitud'
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Error inesperado'
    }
  } finally {
    loading.value = false
  }
}
</script>
