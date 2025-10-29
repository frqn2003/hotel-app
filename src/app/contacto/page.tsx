'use client'

import { useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageCircle,
  Building,
  Loader2
} from "lucide-react"

type FormData = {
  nombre: string
  email: string
  telefono: string
  asunto: string
  mensaje: string
  tipoConsulta: "reserva" | "informacion" | "queja" | "sugerencia" | "otros"
}

type FormEstado = {
  enviando: boolean
  enviado: boolean
  error: string
}

const informacionContacto = {
  telefono: "+54 11 1234-5678",
  email: "info@nextlujos.com",
  direccion: "Av. del Libertador 1234, CABA, Argentina",
  horarios: "Lunes a Domingo: 24hs"
}

const tiposConsulta = [
  { value: "reserva", label: "Consulta sobre Reservas" },
  { value: "informacion", label: "Información General" },
  { value: "queja", label: "Queja o Reclamo" },
  { value: "sugerencia", label: "Sugerencia" },
  { value: "otros", label: "Otros" }
]

export default function PaginaContacto() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
    tipoConsulta: "informacion"
  })

  const [formEstado, setFormEstado] = useState<FormEstado>({
    enviando: false,
    enviado: false,
    error: ""
  })

  const handleInputChange = (campo: keyof FormData, valor: string) => {
    setFormData(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const validarFormulario = (): boolean => {
    if (!formData.nombre.trim()) {
      setFormEstado(prev => ({ ...prev, error: "El nombre es requerido" }))
      return false
    }

    if (!formData.email.trim()) {
      setFormEstado(prev => ({ ...prev, error: "El email es requerido" }))
      return false
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormEstado(prev => ({ ...prev, error: "El formato del email es inválido" }))
      return false
    }

    if (!formData.mensaje.trim()) {
      setFormEstado(prev => ({ ...prev, error: "El mensaje es requerido" }))
      return false
    }

    if (formData.mensaje.length < 10) {
      setFormEstado(prev => ({ ...prev, error: "El mensaje debe tener al menos 10 caracteres" }))
      return false
    }

    setFormEstado(prev => ({ ...prev, error: "" }))
    return true
  }

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    setFormEstado(prev => ({ ...prev, enviando: true, error: "" }))

    try {
      // Envío real a la API
      const response = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          mensaje: `
Tipo de Consulta: ${formData.tipoConsulta}
Asunto: ${formData.asunto || 'No especificado'}

Mensaje:
${formData.mensaje}

---
Enviado desde el formulario de contacto de Next Lujos Hotel
          `.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el mensaje')
      }

      if (data.success) {
        setFormEstado(prev => ({ ...prev, enviando: false, enviado: true }))
        
        // Resetear formulario después de enviar
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          asunto: "",
          mensaje: "",
          tipoConsulta: "informacion"
        })

        // Auto-ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          setFormEstado(prev => ({ ...prev, enviado: false }))
        }, 5000)
      } else {
        throw new Error(data.message || 'Error al enviar el mensaje')
      }

    } catch (error) {
      console.error('Error enviando mensaje:', error)
      setFormEstado(prev => ({ 
        ...prev, 
        enviando: false, 
        error: error instanceof Error ? error.message : "Error al enviar el mensaje. Por favor, intenta nuevamente." 
      }))
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-semibold text-gray-900 mb-4">Contáctenos</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Envíanos tu consulta y te responderemos a la brevedad.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Información de contacto */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Información de Contacto</h2>
                
                <div className="space-y-6">
                  {/* Teléfono */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
                      <p className="text-gray-600">{informacionContacto.telefono}</p>
                      <p className="text-sm text-gray-500">Disponible 24/7</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">{informacionContacto.email}</p>
                      <p className="text-sm text-gray-500">Respuesta en menos de 24h</p>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                      <p className="text-gray-600">{informacionContacto.direccion}</p>
                    </div>
                  </div>

                  {/* Horarios */}
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Horarios de Atención</h3>
                      <p className="text-gray-600">{informacionContacto.horarios}</p>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Building className="h-5 w-5 text-gray-400" />
                    <h4 className="font-semibold text-gray-900">Departamentos</h4>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Reservas: reservas@nextlujos.com</li>
                    <li>• Recepción: recepcion@nextlujos.com</li>
                    <li>• Eventos: eventos@nextlujos.com</li>
                    <li>• Spa & Wellness: spa@nextlujos.com</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Formulario de contacto */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="h-6 w-6 text-gray-400" />
                  <h2 className="text-2xl font-semibold text-gray-900">Envíanos un Mensaje</h2>
                </div>

                {/* Mensajes de estado */}
                {formEstado.error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-red-700">{formEstado.error}</p>
                  </div>
                )}

                {formEstado.enviado && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-900">¡Mensaje enviado exitosamente!</p>
                      <p className="text-emerald-700 text-sm">
                        Hemos recibido tu mensaje y te contactaremos dentro de las próximas 24 horas.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={enviarMensaje} className="space-y-6">
                  {/* Información personal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          id="nombre"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Tu nombre completo"
                          value={formData.nombre}
                          onChange={(e) => handleInputChange("nombre", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="email"
                          id="email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="tu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="tel"
                          id="telefono"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="+54 11 1234-5678"
                          value={formData.telefono}
                          onChange={(e) => handleInputChange("telefono", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="tipoConsulta" className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Consulta *
                      </label>
                      <select
                        id="tipoConsulta"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={formData.tipoConsulta}
                        onChange={(e) => handleInputChange("tipoConsulta", e.target.value)}
                      >
                        {tiposConsulta.map(tipo => (
                          <option key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                      Asunto
                    </label>
                    <input
                      type="text"
                      id="asunto"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Asunto del mensaje (opcional)"
                      value={formData.asunto}
                      onChange={(e) => handleInputChange("asunto", e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                      placeholder="Describe tu consulta, pregunta o solicitud..."
                      value={formData.mensaje}
                      onChange={(e) => handleInputChange("mensaje", e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        Mínimo 10 caracteres
                      </span>
                      <span className={`text-sm ${
                        formData.mensaje.length < 10 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {formData.mensaje.length}/500
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formEstado.enviando}
                    className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {formEstado.enviando ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Enviando Mensaje...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Enviar Mensaje
                      </>
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-500">
                    * Campos obligatorios. Te contactaremos dentro de las próximas 24 horas.
                  </p>
                </form>
              </div>

              {/* Información adicional */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">Tiempos de Respuesta</h3>
                  </div>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>• Reservas: Menos de 2 horas</li>
                    <li>• Información general: 24 horas</li>
                    <li>• Quejas y sugerencias: 48 horas</li>
                    <li>• Urgencias: Llamar por teléfono</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">¿Qué Incluir?</h3>
                  </div>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>• Fechas de interés (para reservas)</li>
                    <li>• Número de huéspedes</li>
                    <li>• Tipo de habitación preferida</li>
                    <li>• Información de contacto completa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}