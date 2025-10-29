export interface ContactFormData {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
  tipoConsulta: 'reserva' | 'informacion' | 'queja' | 'sugerencia' | 'otros'
}

export interface FormEstado {
  enviando: boolean
  enviado: boolean
  error: string
}

export interface ApiContactResponse {
  success: boolean
  message: string
}