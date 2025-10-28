// Servicio para gestión de reservas

import { ApiClient } from './api-base'
import type { 
  Reserva, 
  CrearReservaDto, 
  ActualizarReservaDto,
  FiltrosReserva,
  ApiResponse 
} from '@/types'

class ReservaService extends ApiClient {
  private endpoint = '/reservas'

  async obtenerReservas(filtros?: FiltrosReserva): Promise<ApiResponse<Reserva[]>> {
    const params = new URLSearchParams()
    if (filtros?.userId) params.append('userId', filtros.userId)
    if (filtros?.roomId) params.append('roomId', filtros.roomId)
    if (filtros?.estado) params.append('estado', filtros.estado)
    if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde)
    if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta)

    const queryString = params.toString()
    const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint
    
    return this.get<Reserva[]>(url)
  }

  async obtenerReservaPorId(id: string): Promise<ApiResponse<Reserva>> {
    return this.get<Reserva>(`${this.endpoint}/${id}`)
  }

  async crearReserva(data: CrearReservaDto): Promise<ApiResponse<Reserva>> {
    return this.post<Reserva>(this.endpoint, data)
  }

  async actualizarReserva(id: string, data: ActualizarReservaDto): Promise<ApiResponse<Reserva>> {
    return this.put<Reserva>(`${this.endpoint}/${id}`, data)
  }

  async cancelarReserva(id: string): Promise<ApiResponse<Reserva>> {
    return this.put<Reserva>(`${this.endpoint}/${id}`, { estado: 'CANCELADA' })
  }

  async eliminarReserva(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`${this.endpoint}/${id}`)
  }

  async obtenerReservasDeHoy(): Promise<ApiResponse<Reserva[]>> {
    const hoy = new Date().toISOString().split('T')[0]
    return this.obtenerReservas({
      fechaDesde: hoy,
      fechaHasta: hoy
    })
  }

  async obtenerReservasActivas(): Promise<ApiResponse<Reserva[]>> {
    return this.obtenerReservas({
      estado: 'CONFIRMADA'
    })
  }

  async obtenerCheckinsHoy(): Promise<ApiResponse<Reserva[]>> {
    const hoy = new Date().toISOString().split('T')[0]
    return this.get<Reserva[]>(`${this.endpoint}/checkins-hoy?fecha=${hoy}`)
  }

  async obtenerCheckoutsHoy(): Promise<ApiResponse<Reserva[]>> {
    const hoy = new Date().toISOString().split('T')[0]
    return this.get<Reserva[]>(`${this.endpoint}/checkouts-hoy?fecha=${hoy}`)
  }

  async hacerCheckin(id: string): Promise<ApiResponse<Reserva>> {
    return this.post<Reserva>(`${this.endpoint}/${id}/checkin`, {})
  }

  async hacerCheckout(id: string): Promise<ApiResponse<Reserva>> {
    return this.post<Reserva>(`${this.endpoint}/${id}/checkout`, {})
  }
}

export const reservaService = new ReservaService()
