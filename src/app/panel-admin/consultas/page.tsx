'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
  MessageSquare,
  Clock,
  Send,
  Eye,
  EyeOff
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type Consulta = {
  id: string
  nombre: string
  email: string
  telefono?: string
  asunto: string
  mensaje: string
  estado: "PENDIENTE" | "EN_PROCESO" | "RESPONDIDO" | "CERRADO"
  respuesta?: string
  createdAt: string
  updatedAt: string
}

type FormData = {
  respuesta: string
}

export default function ConsultasPage() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<"todos" | "PENDIENTE" | "EN_PROCESO" | "RESPONDIDO" | "CERRADO">("todos")
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [formData, setFormData] = useState<FormData>({ respuesta: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR" && userData.rol !== "OPERADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
    fetchConsultas()
  }, [])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      
      // Backend deshabilitado - Usando datos mock
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const consultasMock: Consulta[] = [
        {
          id: 'C-001',
          nombre: 'Laura Martínez',
          email: 'laura@example.com',
          telefono: '+598 99 111 222',
          asunto: 'Consulta sobre servicios',
          mensaje: '¿Qué servicios están incluidos en la reserva?',
          estado: 'PENDIENTE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'C-002',
          nombre: 'Pedro García',
          email: 'pedro@example.com',
          telefono: '+598 99 333 444',
          asunto: 'Problema con reserva',
          mensaje: 'No puedo modificar mi reserva desde la página web.',
          estado: 'EN_PROCESO',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString()
        },
        {
          id: 'C-003',
          nombre: 'Ana López',
          email: 'ana@example.com',
          asunto: 'Información sobre eventos',
          mensaje: '¿Es posible organizar un evento corporativo?',
          respuesta: 'Sí, contamos con salas de eventos. Le enviaremos más información por correo.',
          estado: 'RESPONDIDO',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'C-004',
          nombre: 'Roberto Sánchez',
          email: 'roberto@example.com',
          telefono: '+598 99 777 888',
          asunto: 'Solicitud de factura',
          mensaje: 'Necesito la factura de mi última estancia.',
          respuesta: 'Su factura ha sido enviada a su correo electrónico.',
          estado: 'CERRADO',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ]
      
      setConsultas(consultasMock)
    } catch (err) {
      setError("Error al cargar las consultas")
      console.error(err)
      setConsultas([])
    } finally {
      setLoading(false)
    }
  }

  const handleConsultaChange = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setShowDetailModal(true)
  }

  const handleOpenResponseModal = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setFormData({ respuesta: consulta.respuesta || "" })
    setShowResponseModal(true)
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConsulta || !formData.respuesta.trim()) {
      setError("La respuesta no puede estar vacía")
      return
    }

    try {
      setSubmitting(true)
      
      // Backend deshabilitado - Simulando envío de respuesta
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setConsultas(prev => prev.map(c => 
        c.id === selectedConsulta.id
          ? { ...c, respuesta: formData.respuesta, estado: 'RESPONDIDO' as const, updatedAt: new Date().toISOString() }
          : c
      ))
      
      setSuccess("Respuesta enviada correctamente")
      setFormData({ respuesta: "" })
      setShowResponseModal(false)
      fetchConsultas()
    } catch (err) {
      setError("Error al enviar respuesta")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangeEstado = async (id: string, nuevoEstado: string) => {
    try {
      const res = await fetch(`/api/contacto/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevoEstado })
      })

      if (!res.ok) throw new Error("Error al cambiar estado")
      setSuccess("Estado actualizado correctamente")
      fetchConsultas()
    } catch (err) {
      setError("Error al cambiar estado")
      console.error(err)
    }
  }

  const handleCloseModals = () => {
    setShowDetailModal(false)
    setShowResponseModal(false)
    setSelectedConsulta(null)
    setFormData({ respuesta: "" })
    setError("")
  }

  const filteredConsultas = (consultas || []).filter(c => {
    const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.asunto.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterEstado === "todos" || c.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "EN_PROCESO":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "RESPONDIDO":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "CERRADO":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return <Clock className="h-4 w-4" />
      case "EN_PROCESO":
        return <MessageSquare className="h-4 w-4" />
      case "RESPONDIDO":
        return <CheckCircle className="h-4 w-4" />
      case "CERRADO":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Gestión de Consultas
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Consultas de Contacto
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Gestiona y responde las consultas de los clientes
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["PENDIENTE", "EN_PROCESO", "RESPONDIDO", "CERRADO"].map(estado => {
                  const count = consultas.filter(c => c.estado === estado).length
                  return (
                    <div key={estado} className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{count}</p>
                      <p className="text-xs text-gray-500">{estado.replace("_", " ")}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o asunto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value as any)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="RESPONDIDO">Respondido</option>
                  <option value="CERRADO">Cerrado</option>
                </select>
              </div>
            </div>

            {/* Mensajes */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800">{success}</p>
              </div>
            )}
          </section>

          {/* Tabla de consultas */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : filteredConsultas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <MessageSquare className="h-8 w-8 text-gray-300" />
                <p className="text-gray-500">No hay consultas para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Asunto</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Fecha</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredConsultas.map((consulta) => (
                      <tr key={consulta.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{consulta.nombre}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 line-clamp-1">{consulta.asunto}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{consulta.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={consulta.estado}
                            onChange={(e) => handleChangeEstado(consulta.id, e.target.value)}
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getEstadoColor(consulta.estado)}`}
                          >
                            <option value="PENDIENTE">Pendiente</option>
                            <option value="EN_PROCESO">En proceso</option>
                            <option value="RESPONDIDO">Respondido</option>
                            <option value="CERRADO">Cerrado</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">
                            {new Date(consulta.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetail(consulta)}
                              className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              Ver
                            </button>
                            <button
                              onClick={() => handleOpenResponseModal(consulta)}
                              className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors"
                            >
                              Responder
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal de detalle */}
      {showDetailModal && selectedConsulta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-8 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold text-gray-900">Detalle de Consulta</h2>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Nombre</p>
                  <p className="font-medium text-gray-900">{selectedConsulta.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-900">{selectedConsulta.email}</p>
                </div>
                {selectedConsulta.telefono && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Teléfono</p>
                    <p className="font-medium text-gray-900">{selectedConsulta.telefono}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-1">Fecha</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedConsulta.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Asunto</p>
                <p className="font-medium text-gray-900 text-lg">{selectedConsulta.asunto}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Mensaje</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedConsulta.mensaje}</p>
                </div>
              </div>

              {selectedConsulta.respuesta && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Respuesta</p>
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedConsulta.respuesta}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCloseModals}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleOpenResponseModal(selectedConsulta)
                  }}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors"
                >
                  Responder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de respuesta */}
      {showResponseModal && selectedConsulta && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">Responder Consulta</h2>
              <button
                onClick={handleCloseModals}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitResponse} className="p-8 flex flex-col gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Consulta de: {selectedConsulta.nombre}</p>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">{selectedConsulta.asunto}</p>
                  <p className="text-sm text-gray-600">{selectedConsulta.mensaje}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Respuesta *
                </label>
                <textarea
                  value={formData.respuesta}
                  onChange={(e) => setFormData({ respuesta: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  rows={6}
                  placeholder="Escribe tu respuesta aquí..."
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitting ? "Enviando..." : "Enviar Respuesta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
