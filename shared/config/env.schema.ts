import { z } from 'zod'

/**
 * Esquema de validación para las variables de entorno del Frontend
 * Define todas las variables requeridas y sus formatos
 * Usando Zod 4 API
 */
export const envSchema = z.object({
  // Configuración del Sitio
  NUXT_PUBLIC_SITE_URL: z.preprocess(
    val => val === '' ? undefined : val,
    z.url({ error: 'URL inválida' }).optional().default('http://localhost:3000')
  ),

  // API
  NUXT_PUBLIC_API_BASE_URL: z.url({ error: 'API Base URL inválida' }).default('http://localhost:3001'),

  // Entorno
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development')
})

/**
 * Tipo inferido del esquema
 */
export type EnvConfig = z.infer<typeof envSchema>

/**
 * Valida un objeto de configuración contra el esquema
 */
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  try {
    return envSchema.parse(config)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const missingVars = (error as z.ZodError).issues
        .map((issue: z.ZodIssue) => issue.path.join('.'))
        .join(', ')
      throw new Error(
        `❌ Error de validación de variables de entorno en el Frontend. Variables inválidas o faltantes: ${missingVars}`
      )
    }
    throw error
  }
}
