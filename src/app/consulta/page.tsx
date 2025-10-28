'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react'

type UserSession = {
  id: string
  nombre: string
  correo: string
}

export default function NuevaConsulta() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = localStorage.getItem('userSession')
    if (session) {
      const userData = JSON.parse(session)
      setUserSession(userData)
      setNombre(userData.nombre || '')
      setEmail(userData.correo || '')
    }
  }, [])

  const enviarConsulta = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre || !email || !asunto || !mensaje) {
      setError('Por favor complete todos los campos obligatorios')
      return
    }

    try {
      setEnviando(true)
      setError(null)

      const response = await fetch('/api/contactos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          email,
          telefono,
          asunto,
          mensaje,
          userId: userSession?.id
        })
      })

      const data = await response.json()

      if (data.success) {
        setEnviado(true)
        setNombre('')
        setEmail('')
        setTelefono('')
        setAsunto('')
        setMensaje('')
        
        setTimeout(() => {
          setEnviado(false)
        }, 5000)
      } else {
        setError(data.error || 'Error al enviar la consulta')
      }
    } catch (err) {
      setError('Error al enviar la consulta')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor max-w-3xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-black text-white mb-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Contactanos
            </h1>
            <p className="text-base text-gray-600 mt-2">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte
            </p>
          </section>

          {/* Mensajes */}
          {enviado && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-700">¡Consulta enviada!</p>
                <p className="text-sm text-emerald-600">Te responderemos a la brevedad</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <form onSubmit={enviarConsulta} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Juan Pérez"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="juan@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <select
                  value={asunto}
                  onChange={(e) => setAsunto(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Seleccione un asunto</option>
                  <option value="Consulta sobre reserva">Consulta sobre reserva</option>
                  <option value="Problema con pago">Problema con pago</option>
                  <option value="Solicitud de información">Solicitud de información</option>
                  <option value="Modificación de reserva">Modificación de reserva</option>
                  <option value="Cancelación">Cancelación</option>
                  <option value="Servicios del hotel">Servicios del hotel</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Describe tu consulta con el mayor detalle posible..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="h-5 w-5" />
                {enviando ? 'Enviando...' : 'Enviar Consulta'}
              </button>
            </form>
          </section>

          {/* Info de contacto adicional */}
          <section className="bg-black text-white rounded-3xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-4">Otros medios de contacto</h2>
            <div className="space-y-3 text-white/90">
              <p>📧 Email: reservas@nextlujos.com</p>
              <p>📞 Teléfono: +54 11 5000-1000</p>
              <p>🕐 Horario: Lunes a Viernes 9:00 - 18:00hs</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
