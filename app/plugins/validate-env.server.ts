import { validateEnv } from '../../shared/config/env.schema'

export default defineNuxtPlugin(() => {
  // Validar variables de entorno en runtime
  try {
    validateEnv(process.env)
  } catch (error) {
    console.error('❌ Error de validación de variables de entorno:', error)
    throw error
  }
})
