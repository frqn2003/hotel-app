'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Search,
  Filter,
  Bed,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Edit,
  Calendar,
  Wifi,
  Coffee,
  Car,
  Snowflake,
  Tv,
  Loader,
  AlertCircle
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type Habitacion = {
  id: string
  numero: number
  tipo: string
  precio: number
  capacidad: number
  estado: "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO" | "LIMPIEZA" | "RESERVADA"
  descripcion?: string
  comodidades?: string[]
  imagen?: string
  lat?: number
  lng?: number
  createdAt: string
  updatedAt: string
}

type Filtros = {
  estado: string
  tipo: string
  piso: string
  servicios: string[]
}

export default function HabitacionesAdmin() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filtros, setFiltros] = useState<Filtros>({
    estado: "",
    tipo: "",
    piso: "",
    servicios: []
  })
  const [vista, setVista] = useState<"grid" | "lista">("grid")

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "OPERADOR" && userData.rol !== "ADMINISTRADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
    fetchHabitaciones()
  }, [])

  const fetchHabitaciones = async () => {
    try {
      setLoading(true)
      setError("")
      
      const params = new URLSearchParams()
      if (filtros.estado) params.append('estado', filtros.estado)
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      
      const response = await fetch(`/api/habitaciones?${params.toString()}`)
      if (!response.ok) throw new Error("Error al cargar habitaciones")
      
      const data = await response.json()
      setHabitaciones(data.data || [])
    } catch (err) {
      setError("Error al cargar las habitaciones")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHabitaciones()
  }, [filtros.estado, filtros.tipo])

  const handleFiltroChange = (campo: keyof Filtros, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const toggleServicio = (servicioId: string) => {
    setFiltros(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter(s => s !== servicioId)
        : [...prev.servicios, servicioId]
    }))
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "OCUPADA":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "RESERVADA":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "LIMPIEZA":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "MANTENIMIENTO":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return <CheckCircle className="h-4 w-4" />
      case "OCUPADA":
        return <User className="h-4 w-4" />
      case "RESERVADA":
        return <Clock className="h-4 w-4" />
      case "LIMPIEZA":
        return <RefreshCw className="h-4 w-4" />
      case "MANTENIMIENTO":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const tiposHabitacion = Array.from(new Set(habitaciones.map(h => h.tipo)))

  const habitacionesFiltradas = habitaciones.filter(habitacion => {
    const coincideEstado = !filtros.estado || habitacion.estado === filtros.estado
    const coincideTipo = !filtros.tipo || habitacion.tipo === filtros.tipo
    const coincideServicios = filtros.servicios.length === 0 || 
      filtros.servicios.every(servicio => 
        habitacion.comodidades?.includes(servicio)
      )
    return coincideEstado && coincideTipo && coincideServicios
  })

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-admin"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Gestión de Habitaciones</h1>
              <p className="text-gray-600">Administra el estado y disponibilidad de las habitaciones</p>
            </div>
            <a
              href="/panel-admin/habitaciones/crear"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              <Bed className="h-5 w-5" />
              Nueva Habitación
            </a>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue"
                    value={filtros.estado}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="DISPONIBLE">Disponible</option>
                    <option value="OCUPADA">Ocupada</option>
                    <option value="RESERVADA">Reservada</option>
                    <option value="LIMPIEZA">Limpieza</option>
                    <option value="MANTENIMIENTO">Mantenimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-the"
                    value={filtros.tipo}
                    onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                  >
                    <option value="">Todos los tipos</option>
                    {tiposHabitacion.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : (
            <>
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Disponibles</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitaciones.filter(h => h.estado === "DISPONIBLE").length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Ocupadas</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitaciones.filter(h => h.estado === "OCUPADA").length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Clock className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Reservadas</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitaciones.filter(h => h.estado === "RESERVADA").length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                      <RefreshCw className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Limpieza</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitaciones.filter(h => h.estado === "LIMPIEZA").length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                      <XCircle className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">Mantenimiento</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitaciones.filter(h => h.estado === "MANTENIMIENTO").length}
                  </p>
                </div>
              </div>

              {/* Lista de habitaciones */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Habitaciones ({habitacionesFiltradas.length})
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setVista("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        vista === "grid"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <div className="h-5 w-5 grid grid-cols-2 gap-0.5">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setVista("lista")}
                      className={`p-2 rounded-lg transition-colors ${
                        vista === "lista"
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <div className="h-5 w-5 space-y-1">
                        <div className="bg-current rounded-sm h-0.5"></div>
                        <div className="bg-current rounded-sm h-0.5"></div>
                        <div className="bg-current rounded-sm h-0.5"></div>
                      </div>
                    </button>
                  </div>
                </div>

                {habitacionesFiltradas.length === 0 ? (
                  <div className="text-center py-16">
                    <Bed className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron habitaciones con los filtros seleccionados</p>
                  </div>
                ) : vista === "grid" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {habitacionesFiltradas.map((habitacion) => (
                      <div key={habitacion.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Habitación {habitacion.numero}</h3>
                            <p className="text-sm text-gray-500">{habitacion.tipo}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(habitacion.estado)}`}>
                            {getEstadoIcon(habitacion.estado)}
                            {habitacion.estado}
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Capacidad:</span>
                            <span className="font-medium">{habitacion.capacidad} personas</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Precio:</span>
                            <span className="font-medium">${habitacion.precio}/noche</span>
                          </div>
                          {habitacion.descripcion && (
                            <div className="text-sm">
                              <span className="text-gray-500">Descripción:</span>
                              <p className="mt-1 text-gray-700">{habitacion.descripcion}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={`/panel-admin/habitaciones/${habitacion.id}`}
                            className="flex-1 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors text-center"
                          >
                            <Eye className="h-4 w-4 inline mr-1" />
                            Ver detalles
                          </a>
                          <a
                            href={`/panel-admin/habitaciones/${habitacion.id}/editar`}
                            className="flex-1 bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-center"
                          >
                            <Edit className="h-4 w-4 inline mr-1" />
                            Editar
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Habitación</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Capacidad</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Precio</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {habitacionesFiltradas.map((habitacion) => (
                          <tr key={habitacion.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium text-gray-900">#{habitacion.numero}</p>
                                <p className="text-sm text-gray-500">ID: {habitacion.id}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900">{habitacion.tipo}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(habitacion.estado)}`}>
                                {getEstadoIcon(habitacion.estado)}
                                {habitacion.estado}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-900">{habitacion.capacidad} personas</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">${habitacion.precio}/noche</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                <a
                                  href={`/panel-admin/habitaciones/${habitacion.id}`}
                                  className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                  <Eye className="h-4 w-4" />
                                </a>
                                <a
                                  href={`/panel-admin/habitaciones/${habitacion.id}/editar`}
                                  className="text-gray-600 hover:text-gray-700 text-sm"
                                >
                                  <Edit className="h-4 w-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}