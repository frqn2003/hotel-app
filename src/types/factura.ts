// Tipos para el módulo de Facturas

export interface DetalleFactura {
  descripcion: string
  cantidad: number
  precio: number
}

export interface Factura {
  id: string
  numeroFactura: string
  subtotal: number
  impuestos: number
  total: number
  detalles: DetalleFactura[]
  emitidaEl: string
  createdAt: string
  paymentId: string
  payment?: {
    id: string
    monto: number
    metodoPago: string
  }
}

export interface CrearFacturaDto {
  paymentId: string
  subtotal: number
  impuestos: number
  detalles: DetalleFactura[]
}

export interface FiltrosFactura {
  paymentId?: string
}
