// Servicio para gestionar notificaciones

import { apiClient } from './api-base'
import type {
  Notificacion,
  CrearNotificacionDto,
  ActualizarNotificacionDto,
  FiltrosNotificacion,
  ApiResponse,
} from '@/types'

export const notificacionService = {
  /**
   * Obtener notificaciones del usuario
   */
  async obtenerNotificaciones(
    filtros: FiltrosNotificacion
  ): Promise<ApiResponse<Notificacion[]>> {
    return apiClient.get<Notificacion[]>('/notificaciones', filtros)
  },

  /**
   * Obtener una notificación específica por ID
   */
  async obtenerNotificacion(id: string): Promise<ApiResponse<Notificacion>> {
    return apiClient.get<Notificacion>(`/notificaciones/${id}`)
  },

  /**
   * Crear una nueva notificación
   */
  async crearNotificacion(
    datos: CrearNotificacionDto
  ): Promise<ApiResponse<Notificacion>> {
    return apiClient.post<Notificacion>('/notificaciones', datos)
  },

  /**
   * Marcar notificación como leída/no leída
   */
  async actualizarNotificacion(
    id: string,
    datos: ActualizarNotificacionDto
  ): Promise<ApiResponse<Notificacion>> {
    return apiClient.put<Notificacion>(`/notificaciones/${id}`, datos)
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async marcarTodasLeidas(userId: string): Promise<ApiResponse<void>> {
    return apiClient.put<void>('/notificaciones/marcar-todas-leidas', { userId })
  },

  /**
   * Eliminar una notificación específica
   */
  async eliminarNotificacion(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/notificaciones/${id}`)
  },

  /**
   * Eliminar todas las notificaciones leídas de un usuario
   */
  async eliminarNotificacionesLeidas(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/notificaciones?userId=${userId}`)
  },
}
