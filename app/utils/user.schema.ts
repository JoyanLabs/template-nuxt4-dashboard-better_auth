import { z } from 'zod'
import type { ApiRequestBody } from '#open-fetch'

// Tipos derivados de nuxt-open-fetch
export type CreateUserDTO = ApiRequestBody<'UserController_createUser'>
export type UpdateUserDTO = ApiRequestBody<'UserController_updateUser'>
export type SetPasswordDTO = ApiRequestBody<'UserController_setPassword'>

/**
 * Esquema de validación para la creación de usuarios
 * Satisface la interfaz CreateUserDTO del composable de API
 */
export const createUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['admin', 'moderator', 'user'])
})

/**
 * Esquema de validación para la actualización de usuarios
 */
export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  email: z.string().email('Email inválido').optional()
})

/**
 * Esquema de validación para el cambio de contraseña (Admin)
 */
export const setUserPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
})

// Tipados derivados
export type CreateUserForm = z.infer<typeof createUserSchema>
export type UpdateUserForm = z.infer<typeof updateUserSchema>
export type SetPasswordForm = z.infer<typeof setUserPasswordSchema>

// Verificaciones de compatibilidad con DTOs
const _checkCreate: CreateUserDTO = {} as CreateUserForm
const _checkUpdate: UpdateUserDTO = {} as UpdateUserForm
const _checkPassword: SetPasswordDTO = {} as SetPasswordForm
export { _checkCreate, _checkPassword, _checkUpdate }
