// Tipos para el módulo de Contacto

export type EstadoConsulta = 'PENDIENTE' | 'EN_PROCESO' | 'RESPONDIDO' | 'CERRADO'

export interface Consulta {
  id: string
  nombre: string
  email: string
  telefono: string | null
  asunto: string
  mensaje: string
  estado: EstadoConsulta
  respuesta: string | null
  createdAt: string
  updatedAt: string
  userId: string | null
  operadorId: string | null
  user?: {
    id: string
    nombre: string
    email: string
  }
  operador?: {
    id: string
    nombre: string
    email: string
  }
}

export interface CrearConsultaDto {
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
  userId?: string
}

export interface ResponderConsultaDto {
  respuesta: string
  estado: EstadoConsulta
  operadorId: string
}

export interface FiltrosConsulta {
  estado?: EstadoConsulta
  userId?: string
  operadorId?: string
}
