// Tipos para respuestas de las APIs

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
  noLeidas?: number
}

// Tipos para paginación
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page?: number
  limit?: number
}
