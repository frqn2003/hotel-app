// Tipos para el módulo de Actividades

export type TipoActividad =
  | 'CHECKIN'
  | 'CHECKOUT'
  | 'RESERVA_CREADA'
  | 'RESERVA_MODIFICADA'
  | 'RESERVA_CANCELADA'
  | 'PAGO_PROCESADO'
  | 'CAMBIO_ESTADO_HABITACION'
  | 'MANTENIMIENTO_INICIADO'
  | 'MANTENIMIENTO_COMPLETADO'

export interface Actividad {
  id: string
  tipo: TipoActividad
  descripcion: string
  metadata: Record<string, any> | null
  createdAt: string
  userId: string | null
  operadorId: string | null
  reservationId: string | null
  roomId: string | null
  user?: {
    id: string
    nombre: string
  }
  operador?: {
    id: string
    nombre: string
  }
  reservation?: {
    id: string
    fechaEntrada: string
    fechaSalida: string
  }
  room?: {
    numero: number
    tipo: string
  }
}

export interface CrearActividadDto {
  tipo: TipoActividad
  descripcion: string
  userId?: string
  operadorId?: string
  reservationId?: string
  roomId?: string
  metadata?: Record<string, any>
}

export interface CheckinDto {
  reservationId: string
  operadorId: string
  metadata?: Record<string, any>
}

export interface CheckoutDto {
  reservationId: string
  operadorId: string
  metadata?: Record<string, any>
}

export interface FiltrosActividad {
  tipo?: TipoActividad
  userId?: string
  reservationId?: string
  roomId?: string
  limit?: number
}
