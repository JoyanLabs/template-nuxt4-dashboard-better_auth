/**
 * Utilidades y tipos para llamadas API
 * Tipos genéricos reutilizables para respuestas paginadas
 */

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

/**
 * Tipo genérico para items con timestamps
 */
export interface TimestampedItem {
  id: string
  createdAt?: string
  updatedAt?: string
}
