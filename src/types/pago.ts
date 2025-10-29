// Tipos para el módulo de Pagos

export type MetodoPago = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA' | 'STRIPE'
export type EstadoPago = 'PENDIENTE' | 'PROCESANDO' | 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO'

export interface Pago {
  id: string
  monto: number
  metodoPago: MetodoPago
  estado: EstadoPago
  stripePaymentId: string | null
  fechaPago: string | null
  createdAt: string
  updatedAt: string
  reservationId: string
  reservation?: {
    id: string
    user: {
      nombre: string
      email: string
    }
    room: {
      numero: number
      tipo: string
    }
  }
  invoice?: {
    numeroFactura: string
  }
}

export interface CrearPagoDto {
  reservationId: string
  monto: number
  metodoPago: MetodoPago
  stripePaymentId?: string
}

export interface ActualizarPagoDto {
  estado: EstadoPago
}

export interface FiltrosPago {
  reservationId?: string
  estado?: EstadoPago
}
