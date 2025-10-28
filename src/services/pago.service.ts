// Servicio para gestionar pagos

import { apiClient } from './api-base'
import type {
  Pago,
  CrearPagoDto,
  ActualizarPagoDto,
  FiltrosPago,
  ApiResponse,
} from '@/types'

export const pagoService = {
  /**
   * Obtener todos los pagos con filtros opcionales
   */
  async obtenerPagos(filtros?: FiltrosPago): Promise<ApiResponse<Pago[]>> {
    return apiClient.get<Pago[]>('/pagos', filtros)
  },

  /**
   * Obtener un pago específico por ID
   */
  async obtenerPago(id: string): Promise<ApiResponse<Pago>> {
    return apiClient.get<Pago>(`/pagos/${id}`)
  },

  /**
   * Crear un nuevo pago
   */
  async crearPago(datos: CrearPagoDto): Promise<ApiResponse<Pago>> {
    return apiClient.post<Pago>('/pagos', datos)
  },

  /**
   * Actualizar el estado de un pago
   */
  async actualizarPago(
    id: string,
    datos: ActualizarPagoDto
  ): Promise<ApiResponse<Pago>> {
    return apiClient.put<Pago>(`/pagos/${id}`, datos)
  },

  /**
   * Eliminar un pago (solo si está PENDIENTE o FALLIDO)
   */
  async eliminarPago(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/pagos/${id}`)
  },
}
