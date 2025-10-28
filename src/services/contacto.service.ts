// Servicio para gestionar consultas de contacto

import { apiClient } from './api-base'
import type {
  Consulta,
  CrearConsultaDto,
  ResponderConsultaDto,
  FiltrosConsulta,
  ApiResponse,
} from '@/types'

export const contactoService = {
  /**
   * Obtener todas las consultas con filtros opcionales
   */
  async obtenerConsultas(filtros?: FiltrosConsulta): Promise<ApiResponse<Consulta[]>> {
    return apiClient.get<Consulta[]>('/contacto', filtros)
  },

  /**
   * Obtener una consulta específica por ID
   */
  async obtenerConsulta(id: string): Promise<ApiResponse<Consulta>> {
    return apiClient.get<Consulta>(`/contacto/${id}`)
  },

  /**
   * Crear una nueva consulta
   */
  async crearConsulta(datos: CrearConsultaDto): Promise<ApiResponse<Consulta>> {
    return apiClient.post<Consulta>('/contacto', datos)
  },

  /**
   * Responder o actualizar una consulta
   */
  async responderConsulta(
    id: string,
    datos: ResponderConsultaDto
  ): Promise<ApiResponse<Consulta>> {
    return apiClient.put<Consulta>(`/contacto/${id}`, datos)
  },

  /**
   * Eliminar una consulta
   */
  async eliminarConsulta(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/contacto/${id}`)
  },
}
