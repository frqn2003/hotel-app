// Tipos para el sistema de reservas

export type EstadoReserva = 
  | 'PENDIENTE'
  | 'CONFIRMADA'
  | 'CHECKIN'
  | 'CHECKOUT'
  | 'CANCELADA'
  | 'NO_SHOW'

export interface Reserva {
  id: string
  userId: string
  roomId: string
  fechaEntrada: string
  fechaSalida: string
  huespedes: number
  estado: EstadoReserva
  precioTotal: number
  notasEspeciales?: string
  pagado: boolean
  createdAt: string
  updatedAt: string
  user?: {
    id: string
    nombre: string
    email: string
    telefono?: string
  }
  room?: {
    id: string
    numero: string
    tipo: string
    precioPorNoche: number
  }
}

export interface CrearReservaDto {
  userId: string
  roomId: string
  fechaEntrada: string
  fechaSalida: string
  huespedes: number
  notasEspeciales?: string
}

export interface ActualizarReservaDto {
  fechaEntrada?: string
  fechaSalida?: string
  huespedes?: number
  estado?: EstadoReserva
  notasEspeciales?: string
  pagado?: boolean
}

export interface FiltrosReserva {
  userId?: string
  roomId?: string
  estado?: EstadoReserva
  fechaDesde?: string
  fechaHasta?: string
}
