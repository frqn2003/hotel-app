// Servicio para gestionar actividades

import { apiClient } from './api-base'
import type {
  Actividad,
  CrearActividadDto,
  CheckinDto,
  CheckoutDto,
  FiltrosActividad,
  ApiResponse,
} from '@/types'

export const actividadService = {
  /**
   * Obtener todas las actividades con filtros opcionales
   */
  async obtenerActividades(filtros?: FiltrosActividad): Promise<ApiResponse<Actividad[]>> {
    return apiClient.get<Actividad[]>('/actividades', filtros)
  },

  /**
   * Crear una nueva actividad
   */
  async crearActividad(datos: CrearActividadDto): Promise<ApiResponse<Actividad>> {
    return apiClient.post<Actividad>('/actividades', datos)
  },

  /**
   * Registrar un check-in
   */
  async registrarCheckin(datos: CheckinDto): Promise<ApiResponse<Actividad>> {
    return apiClient.post<Actividad>('/actividades/checkin', datos)
  },

  /**
   * Registrar un check-out
   */
  async registrarCheckout(datos: CheckoutDto): Promise<ApiResponse<Actividad>> {
    return apiClient.post<Actividad>('/actividades/checkout', datos)
  },
}
