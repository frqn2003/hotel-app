// Servicio para gestionar habitaciones

import { apiClient } from './api-base'
import type { Habitacion, ApiResponse } from '@/types'

export const habitacionService = {
  /**
   * Obtener todas las habitaciones
   */
  async obtenerHabitaciones(): Promise<ApiResponse<Habitacion[]>> {
    return apiClient.get<Habitacion[]>('/habitaciones')
  },

  /**
   * Obtener una habitación específica por ID
   */
  async obtenerHabitacion(id: string): Promise<ApiResponse<Habitacion>> {
    return apiClient.get<Habitacion>(`/habitaciones/${id}`)
  },

  /**
   * Crear una nueva habitación
   */
  async crearHabitacion(datos: Partial<Habitacion>): Promise<ApiResponse<Habitacion>> {
    return apiClient.post<Habitacion>('/habitaciones/crear', datos)
  },

  /**
   * Actualizar una habitación
   */
  async actualizarHabitacion(
    id: string,
    datos: Partial<Habitacion>
  ): Promise<ApiResponse<Habitacion>> {
    return apiClient.put<Habitacion>(`/habitaciones/${id}`, datos)
  },

  /**
   * Eliminar una habitación
   */
  async eliminarHabitacion(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/habitaciones/${id}`)
  },
}
