'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import {
  MessageSquare,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Send,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  User
} from 'lucide-react'

type Consulta = {
  id: string
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
  respuesta?: string
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'RESPONDIDO' | 'CERRADO'
  createdAt: string
  updatedAt: string
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

export default function GestionConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('')
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<Consulta | null>(null)
  const [respuesta, setRespuesta] = useState('')
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false)
  const [operadorId, setOperadorId] = useState<string>('')

  useEffect(() => {
    // Obtener ID del operador desde sesión
    const session = localStorage.getItem('userSession')
    if (session) {
      const userData = JSON.parse(session)
      setOperadorId(userData.id)
    }
    cargarConsultas()
  }, [])

  const cargarConsultas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Backend deshabilitado - Usando datos mock
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let consultasMock: Consulta[] = [
        {
          id: 'C-001',
          nombre: 'Carlos Rodríguez',
          email: 'carlos@example.com',
          telefono: '+598 99 123 456',
          asunto: 'Consulta sobre reserva',
          mensaje: '¿Es posible cambiar la fecha de mi reserva?',
          estado: 'PENDIENTE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'C-002',
          nombre: 'María González',
          email: 'maria@example.com',
          telefono: '+598 99 234 567',
          asunto: 'Pregunta sobre servicios',
          mensaje: '¿Incluyen desayuno las habitaciones?',
          respuesta: 'Sí, todas nuestras habitaciones incluyen desayuno buffet.',
          estado: 'RESPONDIDO',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'C-003',
          nombre: 'Ana Martínez',
          email: 'ana@example.com',
          asunto: 'Solicitud de información',
          mensaje: '¿Tienen estacionamiento disponible?',
          estado: 'EN_PROCESO',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
      
      // Filtrar por estado si es necesario
      if (filtroEstado) {
        consultasMock = consultasMock.filter(c => c.estado === filtroEstado)
      }
      
      setConsultas(consultasMock)
    } catch (err) {
      setError('Error al cargar consultas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarConsultas()
  }, [filtroEstado])

  const handleConsultaChange = (consulta: Consulta) => {
    setConsultaSeleccionada(consulta)
    setRespuesta(consulta.respuesta || '')
  }

  const cerrarModal = () => {
    setConsultaSeleccionada(null)
    setRespuesta('')
  }

  const enviarRespuesta = async () => {
    if (!consultaSeleccionada || !respuesta.trim()) return

    try {
      setEnviandoRespuesta(true)
      
      // Backend deshabilitado - Simulando envío de respuesta
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setConsultas(prev => prev.map(c => 
        c.id === consultaSeleccionada.id 
          ? { ...c, respuesta, estado: 'RESPONDIDO' as const, updatedAt: new Date().toISOString() }
          : c
      ))
      
      alert('Respuesta enviada exitosamente')
      cerrarModal()
      
      /* Código original comentado
      const response = await fetch(`/api/contactos/${consultaSeleccionada.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          respuesta,
          operadorId,
          estado: 'RESPONDIDO'
        })
      })

      const data = await response.json()

      if (data.success) {
        alert('Respuesta enviada exitosamente')
        await cargarConsultas()
        cerrarModal()
      } else {
        alert(data.error || 'Error al enviar respuesta')
      }
      */
    } catch (err) {
      alert('Error al enviar respuesta')
    } finally {
      setEnviandoRespuesta(false)
    }
  }

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    try {
      // Backend deshabilitado - Simulando cambio de estado
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setConsultas(prev => prev.map(c => 
        c.id === id ? { ...c, estado: nuevoEstado as any, updatedAt: new Date().toISOString() } : c
      ))
      
      /* Código original comentado
      const response = await fetch(`/api/contactos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado, operadorId })
      })

      const data = await response.json()

      if (data.success) {
        await cargarConsultas()
      } else {
        alert('Error al cambiar estado')
      }
      */
    } catch (err) {
      alert('Error al cambiar estado')
    }
  }

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
      EN_PROCESO: 'bg-blue-50 text-blue-700 border-blue-200',
      RESPONDIDO: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CERRADO: 'bg-gray-50 text-gray-700 border-gray-200'
    }
    return colores[estado] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getEstadoTexto = (estado: string) => {
    const textos: Record<string, string> = {
      PENDIENTE: 'Pendiente',
      EN_PROCESO: 'En Proceso',
      RESPONDIDO: 'Respondido',
      CERRADO: 'Cerrado'
    }
    return textos[estado] || estado
  }

  const estadisticas = {
    pendientes: consultas.filter(c => c.estado === 'PENDIENTE').length,
    enProceso: consultas.filter(c => c.estado === 'EN_PROCESO').length,
    respondidas: consultas.filter(c => c.estado === 'RESPONDIDO').length,
    total: consultas.length
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Gestión de Consultas
                </h1>
                <p className="text-base text-gray-600 mt-2">
                  Responde y gestiona las consultas de los clientes
                </p>
              </div>
              <button
                onClick={cargarConsultas}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </section>

          {/* Estadísticas */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-4">
              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{estadisticas.total}</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                <p className="text-sm text-amber-700 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-amber-900">{estadisticas.pendientes}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                <p className="text-sm text-blue-700 mb-1">En Proceso</p>
                <p className="text-3xl font-bold text-blue-900">{estadisticas.enProceso}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
                <p className="text-sm text-emerald-700 mb-1">Respondidas</p>
                <p className="text-3xl font-bold text-emerald-900">{estadisticas.respondidas}</p>
              </div>
            </div>
          )}

          {/* Filtros */}
          {!loading && !error && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Filtrar por estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendientes</option>
                  <option value="EN_PROCESO">En Proceso</option>
                  <option value="RESPONDIDO">Respondidas</option>
                  <option value="CERRADO">Cerradas</option>
                </select>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando consultas...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Lista de Consultas */}
          {!loading && !error && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
              {consultas.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No hay consultas
                  </h3>
                  <p className="text-gray-500">
                    {filtroEstado ? 'No hay consultas con ese estado' : 'Aún no se han recibido consultas'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {consultas.map((consulta) => (
                    <div
                      key={consulta.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(consulta.estado)}`}>
                              {getEstadoTexto(consulta.estado)}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(consulta.createdAt).toLocaleString('es-AR')}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {consulta.asunto}
                          </h3>
                          
                          <div className="grid gap-2 text-sm mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <User className="h-4 w-4" />
                              <span>{consulta.nombre}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="h-4 w-4" />
                              <span>{consulta.email}</span>
                            </div>
                            {consulta.telefono && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-4 w-4" />
                                <span>{consulta.telefono}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {consulta.mensaje}
                          </p>

                          {consulta.respuesta && (
                            <div className="mt-4 p-4 bg-emerald-50 rounded-xl">
                              <p className="text-xs text-emerald-700 font-medium mb-1">
                                Respuesta de {consulta.operador?.nombre || 'Operador'}:
                              </p>
                              <p className="text-sm text-gray-700">{consulta.respuesta}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => abrirConsulta(consulta)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-all"
                          >
                            <MessageSquare className="h-4 w-4" />
                            {consulta.respuesta ? 'Ver Detalles' : 'Responder'}
                          </button>

                          {consulta.estado === 'PENDIENTE' && (
                            <button
                              onClick={() => cambiarEstado(consulta.id, 'EN_PROCESO')}
                              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-all"
                            >
                              Marcar En Proceso
                            </button>
                          )}

                          {consulta.estado === 'RESPONDIDO' && (
                            <button
                              onClick={() => cambiarEstado(consulta.id, 'CERRADO')}
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
                            >
                              Cerrar Consulta
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* Modal de Respuesta */}
      {consultaSeleccionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {consultaSeleccionada.respuesta ? 'Detalles de Consulta' : 'Responder Consulta'}
              </h2>
              <button
                onClick={cerrarModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Info del Cliente */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                <div className="grid gap-3">
                  <div>
                    <p className="text-sm text-gray-600">Nombre:</p>
                    <p className="font-medium">{consultaSeleccionada.nombre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium">{consultaSeleccionada.email}</p>
                  </div>
                  {consultaSeleccionada.telefono && (
                    <div>
                      <p className="text-sm text-gray-600">Teléfono:</p>
                      <p className="font-medium">{consultaSeleccionada.telefono}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Fecha:</p>
                    <p className="font-medium">
                      {new Date(consultaSeleccionada.createdAt).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Consulta */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Asunto:</h3>
                <p className="text-lg text-gray-700 mb-4">{consultaSeleccionada.asunto}</p>
                
                <h3 className="font-semibold text-gray-900 mb-2">Mensaje:</h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">
                  {consultaSeleccionada.mensaje}
                </p>
              </div>

              {/* Respuesta */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Respuesta:</h3>
                <textarea
                  value={respuesta}
                  onChange={(e) => setRespuesta(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Escribe tu respuesta aquí..."
                  disabled={consultaSeleccionada.estado === 'CERRADO'}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={enviarRespuesta}
                  disabled={enviandoRespuesta || !respuesta.trim() || consultaSeleccionada.estado === 'CERRADO'}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  {enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
