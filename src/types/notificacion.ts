// Tipos para el módulo de Notificaciones

export type TipoNotificacion = 'INFO' | 'ALERTA' | 'RECORDATORIO' | 'CONFIRMACION'

export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: TipoNotificacion
  leido: boolean
  enlace: string | null
  createdAt: string
  userId: string
}

export interface CrearNotificacionDto {
  userId: string
  titulo: string
  mensaje: string
  tipo: TipoNotificacion
  enlace?: string
}

export interface ActualizarNotificacionDto {
  leido: boolean
}

export interface FiltrosNotificacion {
  userId: string
  leido?: boolean
  tipo?: TipoNotificacion
  limit?: number
}
