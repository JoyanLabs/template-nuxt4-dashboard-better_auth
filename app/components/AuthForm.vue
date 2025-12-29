<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
    <div class="w-full max-w-md">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-6">
        <!-- Header con ícono y título -->
        <div class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <UIcon name="i-lucide-user" class="size-5 text-gray-600 dark:text-gray-400" />
          </div>
          <div class="text-center space-y-1">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ isSignUp ? 'Crear cuenta' : 'Iniciar sesión' }}
            </h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ isSignUp ? 'Regístrate para comenzar' : 'Ingresa tus credenciales para acceder a tu cuenta' }}
            </p>
          </div>
        </div>

        <!-- Formulario -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-5"
          @submit="handleSubmit"
        >
          <template v-if="isSignUp">
            <UFormField label="Nombre" name="name">
              <UInput
                v-model="state.name"
                size="lg"
                class="w-full"
                placeholder="Ingresa tu nombre"
                autocomplete="name"
              />
            </UFormField>
          </template>

          <UFormField label="Email" name="email">
            <UInput
              v-model="state.email"
              type="email"
              size="lg"
              class="w-full"
              placeholder="Ingresa tu email"
              autocomplete="email"
            />
          </UFormField>

          <UFormField label="Contraseña" name="password">
            <UInput
              v-model="state.password"
              type="password"
              size="lg"
              class="w-full"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
            />
          </UFormField>

          <!-- Remember me checkbox (solo en login) -->
          <div v-if="!isSignUp" class="flex items-center gap-2">
            <UCheckbox
              v-model="rememberMe"
              name="rememberMe"
            />
            <label for="rememberMe" class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              Recordarme
            </label>
          </div>

          <!-- Botón de acción principal -->
          <UButton
            type="submit"
            block
            size="md"
            :loading="loading"
            :disabled="loading"
          >
            {{ isSignUp ? 'Registrarse' : 'Continuar' }}
          </UButton>
        </UForm>

        <!-- Footer con link de toggle y términos -->
        <div class="space-y-4">
          <!-- Toggle entre login y registro -->
          <div class="text-center">
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
              <UButton
                variant="link"
                class="p-0 h-auto text-sm font-medium"
                @click="toggleMode"
              >
                {{ isSignUp ? 'Inicia sesión' : 'Regístrate' }}
              </UButton>
            </span>
          </div>

          <!-- Términos de servicio -->
          <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
            Al iniciar sesión, aceptas nuestros
            <UButton variant="link" class="p-0 h-auto text-sm font-medium">
              Términos de Servicio
            </UButton>
          </p>

          <!-- Mensaje de error -->
          <UAlert
            v-if="error"
            icon="i-lucide-circle-alert"
            color="error"
            variant="soft"
            :title="Array.isArray(error) ? error.join('\n') : error"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const { signIn, signUp } = useAuth()

// Estado del formulario
const isSignUp = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const rememberMe = ref(false)

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
  rememberMe.value = false
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
