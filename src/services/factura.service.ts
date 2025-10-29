// Servicio para gestionar facturas

import { apiClient } from './api-base'
import type {
  Factura,
  CrearFacturaDto,
  FiltrosFactura,
  ApiResponse,
} from '@/types'

export const facturaService = {
  /**
   * Obtener todas las facturas con filtros opcionales
   */
  async obtenerFacturas(filtros?: FiltrosFactura): Promise<ApiResponse<Factura[]>> {
    return apiClient.get<Factura[]>('/facturas', filtros)
  },

  /**
   * Obtener una factura específica por ID
   */
  async obtenerFactura(id: string): Promise<ApiResponse<Factura>> {
    return apiClient.get<Factura>(`/facturas/${id}`)
  },

  /**
   * Crear una nueva factura
   */
  async crearFactura(datos: CrearFacturaDto): Promise<ApiResponse<Factura>> {
    return apiClient.post<Factura>('/facturas', datos)
  },

  /**
   * Eliminar una factura
   */
  async eliminarFactura(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/facturas/${id}`)
  },
}
