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
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type Habitacion = {
  id: string
  numero: string
  tipo: string
  piso: number
  estado: "Disponible" | "Ocupada" | "Mantenimiento" | "Limpieza" | "Reservada"
  ultimaLimpieza: string
  proximaLimpieza: string
  huespedActual?: string
  checkIn?: string
  checkOut?: string
  servicios: string[]
  caracteristicas: string[]
  notas: string
}

type Filtros = {
  estado: string
  tipo: string
  piso: string
  servicios: string[]
}

const habitaciones: Habitacion[] = [
  {
    id: "H-301",
    numero: "301",
    tipo: "Suite Deluxe",
    piso: 3,
    estado: "Ocupada",
    ultimaLimpieza: "12 Nov 2025 - 10:30",
    proximaLimpieza: "13 Nov 2025 - 11:00",
    huespedActual: "María González",
    checkIn: "12 Nov 2025 - 14:30",
    checkOut: "15 Nov 2025 - 12:00",
    servicios: ["wifi", "room-service", "minibar", "spa"],
    caracteristicas: ["vista-al-mar", "terraza", "jacuzzi"],
    notas: "Huésped solicita almohadas extra"
  },
  {
    id: "H-204",
    numero: "204",
    tipo: "Ejecutiva",
    piso: 2,
    estado: "Reservada",
    ultimaLimpieza: "12 Nov 2025 - 09:15",
    proximaLimpieza: "12 Nov 2025 - 16:00",
    huespedActual: "Carlos Rodríguez",
    checkIn: "12 Nov 2025 - 15:30",
    checkOut: "14 Nov 2025 - 11:00",
    servicios: ["wifi", "desayuno", "gimnasio"],
    caracteristicas: ["escritorio", "caja-fuerte"],
    notas: "Check-in pendiente"
  },
  {
    id: "H-105",
    numero: "105",
    tipo: "Standard",
    piso: 1,
    estado: "Disponible",
    ultimaLimpieza: "12 Nov 2025 - 08:00",
    proximaLimpieza: "13 Nov 2025 - 08:00",
    servicios: ["wifi", "tv"],
    caracteristicas: ["vista-jardin"],
    notas: "Habitación lista para ocupar"
  },
  {
    id: "H-401",
    numero: "401",
    tipo: "Presidencial",
    piso: 4,
    estado: "Ocupada",
    ultimaLimpieza: "11 Nov 2025 - 16:45",
    proximaLimpieza: "13 Nov 2025 - 14:00",
    huespedActual: "Ana Martínez",
    checkIn: "11 Nov 2025 - 16:00",
    checkOut: "16 Nov 2025 - 10:00",
    servicios: ["wifi", "room-service", "minibar", "spa", "concierge"],
    caracteristicas: ["vista-panoramica", "terraza", "jacuzzi", "cocina"],
    notas: "Celebración aniversario - botella de champagne"
  },
  {
    id: "H-202",
    numero: "202",
    tipo: "Ejecutiva",
    piso: 2,
    estado: "Mantenimiento",
    ultimaLimpieza: "11 Nov 2025 - 12:30",
    proximaLimpieza: "13 Nov 2025 - 10:00",
    servicios: ["wifi", "desayuno"],
    caracteristicas: ["escritorio"],
    notas: "Problema con aire acondicionado - técnico asignado"
  },
  {
    id: "H-106",
    numero: "106",
    tipo: "Standard",
    piso: 1,
    estado: "Limpieza",
    ultimaLimpieza: "12 Nov 2025 - 13:00",
    proximaLimpieza: "12 Nov 2025 - 15:30",
    servicios: ["wifi", "tv"],
    caracteristicas: ["vista-jardin"],
    notas: "Limpieza en progreso - estimado 30 min"
  },
  {
    id: "H-302",
    numero: "302",
    tipo: "Suite Deluxe",
    piso: 3,
    estado: "Disponible",
    ultimaLimpieza: "12 Nov 2025 - 11:20",
    proximaLimpieza: "13 Nov 2025 - 11:00",
    servicios: ["wifi", "room-service", "minibar"],
    caracteristicas: ["vista-al-mar", "terraza"],
    notas: "Habitación premium lista"
  },
  {
    id: "H-205",
    numero: "205",
    tipo: "Ejecutiva",
    piso: 2,
    estado: "Disponible",
    ultimaLimpieza: "12 Nov 2025 - 10:00",
    proximaLimpieza: "13 Nov 2025 - 10:00",
    servicios: ["wifi", "desayuno", "gimnasio"],
    caracteristicas: ["escritorio", "caja-fuerte"],
    notas: ""
  }
]

const tiposHabitacion = [
  "Suite Deluxe",
  "Presidencial",
  "Ejecutiva",
  "Standard"
]

const serviciosDisponibles = [
  { id: "wifi", nombre: "WiFi", icon: Wifi },
  { id: "room-service", nombre: "Room Service", icon: Coffee },
  { id: "minibar", nombre: "Minibar", icon: "🍷" },
  { id: "spa", nombre: "Spa", icon: "💆" },
  { id: "desayuno", nombre: "Desayuno", icon: "🍳" },
  { id: "gimnasio", nombre: "Gimnasio", icon: "💪" },
  { id: "concierge", nombre: "Concierge", icon: "🔔" },
  { id: "estacionamiento", nombre: "Estacionamiento", icon: Car },
  { id: "tv", nombre: "TV Cable", icon: Tv },
  { id: "ac", nombre: "Aire Acondicionado", icon: Snowflake }
]

export default function EstadoHabitaciones() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<Habitacion | null>(null)
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
        window.location.href = "/panel"
        return
      }
      setUserSession(userData)
    }
  }, [])

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

  const limpiarFiltros = () => {
    setFiltros({
      estado: "",
      tipo: "",
      piso: "",
      servicios: []
    })
  }

  const habitacionesFiltradas = habitaciones.filter(habitacion => {
    const coincideBusqueda = 
      habitacion.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      habitacion.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (habitacion.huespedActual && habitacion.huespedActual.toLowerCase().includes(busqueda.toLowerCase()))

    const coincideEstado = !filtros.estado || habitacion.estado === filtros.estado
    const coincideTipo = !filtros.tipo || habitacion.tipo === filtros.tipo
    const coincidePiso = !filtros.piso || habitacion.piso.toString() === filtros.piso
    const coincideServicios = filtros.servicios.length === 0 || 
      filtros.servicios.every(servicio => habitacion.servicios.includes(servicio))

    return coincideBusqueda && coincideEstado && coincideTipo && coincidePiso && coincideServicios
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "Ocupada":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Reservada":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Limpieza":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "Mantenimiento":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case "Disponible":
        return CheckCircle
      case "Ocupada":
        return User
      case "Reservada":
        return Calendar
      case "Limpieza":
        return "🧹"
      case "Mantenimiento":
        return "🔧"
      default:
        return Clock
    }
  }

  const getServicioIcon = (servicioId: string) => {
    const servicio = serviciosDisponibles.find(s => s.id === servicioId)
    return servicio ? servicio.icon : "📦"
  }

  const getServicioNombre = (servicioId: string) => {
    const servicio = serviciosDisponibles.find(s => s.id === servicioId)
    return servicio ? servicio.nombre : servicioId
  }

  const actualizarEstadoHabitacion = (habitacionId: string, nuevoEstado: string) => {
    // En una aplicación real, aquí se haría una llamada a la API
    alert(`Estado de habitación ${habitacionId} actualizado a: ${nuevoEstado}`)
  }

  const estadisticas = {
    total: habitaciones.length,
    disponibles: habitaciones.filter(h => h.estado === "Disponible").length,
    ocupadas: habitaciones.filter(h => h.estado === "Ocupada").length,
    mantenimiento: habitaciones.filter(h => h.estado === "Mantenimiento").length,
    limpieza: habitaciones.filter(h => h.estado === "Limpieza").length
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-operador"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Estado de Habitaciones</h1>
              <p className="text-gray-600">Monitorea y gestiona el estado de todas las habitaciones en tiempo real</p>
            </div>
            <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors inline-flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Actualizar
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Total Habitaciones</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticas.total}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Disponibles</p>
              <p className="text-2xl font-semibold text-emerald-600">{estadisticas.disponibles}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Ocupadas</p>
              <p className="text-2xl font-semibold text-blue-600">{estadisticas.ocupadas}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">En Limpieza</p>
              <p className="text-2xl font-semibold text-purple-600">{estadisticas.limpieza}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Mantenimiento</p>
              <p className="text-2xl font-semibold text-red-600">{estadisticas.mantenimiento}</p>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por número, tipo, huésped..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent w-full"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setVista(vista === "grid" ? "lista" : "grid")}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Bed className="h-5 w-5" />
                  {vista === "grid" ? "Vista Lista" : "Vista Grid"}
                </button>
                <button
                  onClick={() => setMostrarFiltros(!mostrarFiltros)}
                  className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  Filtros
                </button>
              </div>
            </div>

            {/* Filtros expandibles */}
            {mostrarFiltros && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.estado}
                      onChange={(e) => handleFiltroChange('estado', e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="Disponible">Disponible</option>
                      <option value="Ocupada">Ocupada</option>
                      <option value="Reservada">Reservada</option>
                      <option value="Limpieza">Limpieza</option>
                      <option value="Mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.tipo}
                      onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                    >
                      <option value="">Todos los tipos</option>
                      {tiposHabitacion.map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Piso</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.piso}
                      onChange={(e) => handleFiltroChange('piso', e.target.value)}
                    >
                      <option value="">Todos los pisos</option>
                      <option value="1">Piso 1</option>
                      <option value="2">Piso 2</option>
                      <option value="3">Piso 3</option>
                      <option value="4">Piso 4</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={limpiarFiltros}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>

                {/* Filtros de servicios */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Servicios</label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {serviciosDisponibles.map(servicio => (
                      <label key={servicio.id} className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                        <input
                          type="checkbox"
                          checked={filtros.servicios.includes(servicio.id)}
                          onChange={() => toggleServicio(servicio.id)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm">{servicio.nombre}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vista de habitaciones */}
          {vista === "grid" ? (
            /* Vista Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {habitacionesFiltradas.map((habitacion) => {
                const EstadoIcon = getEstadoIcon(habitacion.estado)
                return (
                  <div
                    key={habitacion.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setHabitacionSeleccionada(habitacion)}
                  >
                    {/* Header de la habitación */}
                    <div className={`p-4 border-b-2 ${getEstadoColor(habitacion.estado)}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">Habitación {habitacion.numero}</h3>
                          <p className="text-sm text-gray-600">{habitacion.tipo}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Piso {habitacion.piso}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {typeof EstadoIcon === 'string' ? (
                              <span className="text-lg">{EstadoIcon}</span>
                            ) : (
                              <EstadoIcon className="h-4 w-4" />
                            )}
                            <span className="text-xs font-medium">{habitacion.estado}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Información de la habitación */}
                    <div className="p-4">
                      {habitacion.huespedActual && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Huésped actual</p>
                          <p className="font-semibold text-gray-900">{habitacion.huespedActual}</p>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Check-in: {habitacion.checkIn}</span>
                            <span>Check-out: {habitacion.checkOut}</span>
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <p className="text-sm text-gray-500">Limpieza</p>
                        <div className="flex justify-between text-xs">
                          <span>Última: {habitacion.ultimaLimpieza}</span>
                          <span>Próxima: {habitacion.proximaLimpieza}</span>
                        </div>
                      </div>

                      {/* Servicios */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 mb-2">Servicios</p>
                        <div className="flex flex-wrap gap-1">
                          {habitacion.servicios.slice(0, 3).map(servicio => (
                            <span key={servicio} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            </span>
                          ))}
                          {habitacion.servicios.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              +{habitacion.servicios.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notas */}
                      {habitacion.notas && (
                        <div className="border-t pt-2">
                          <p className="text-xs text-gray-500 truncate" title={habitacion.notas}>
                            📝 {habitacion.notas}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            /* Vista Lista */
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Habitación
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Huésped
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in/out
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Limpieza
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {habitacionesFiltradas.map((habitacion) => {
                      const EstadoIcon = getEstadoIcon(habitacion.estado)
                      return (
                        <tr key={habitacion.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                Habitación {habitacion.numero}
                              </div>
                              <div className="text-sm text-gray-500">{habitacion.tipo} • Piso {habitacion.piso}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(habitacion.estado)}`}>
                              {typeof EstadoIcon === 'string' ? (
                                <span>{EstadoIcon}</span>
                              ) : (
                                <EstadoIcon className="h-4 w-4" />
                              )}
                              {habitacion.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {habitacion.huespedActual ? (
                              <div>
                                <div className="text-sm font-medium text-gray-900">{habitacion.huespedActual}</div>
                                <div className="text-sm text-gray-500">Ocupada</div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {habitacion.checkIn && habitacion.checkOut ? (
                              <div className="text-sm text-gray-900">
                                <div>IN: {habitacion.checkIn}</div>
                                <div>OUT: {habitacion.checkOut}</div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              <div>Última: {habitacion.ultimaLimpieza}</div>
                              <div>Próxima: {habitacion.proximaLimpieza}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setHabitacionSeleccionada(habitacion)}
                                className="text-blue-600 hover:text-blue-900 transition-colors"
                                title="Ver detalle"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => actualizarEstadoHabitacion(habitacion.id, "Limpieza")}
                                className="text-purple-600 hover:text-purple-900 transition-colors"
                                title="Marcar para limpieza"
                              >
                                <span className="text-lg">🧹</span>
                              </button>
                              <button
                                onClick={() => actualizarEstadoHabitacion(habitacion.id, "Mantenimiento")}
                                className="text-red-600 hover:text-red-900 transition-colors"
                                title="Reportar mantenimiento"
                              >
                                <span className="text-lg">🔧</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {habitacionesFiltradas.length === 0 && (
                <div className="text-center py-12">
                  <Bed className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron habitaciones</h3>
                  <p className="text-gray-600">No hay habitaciones que coincidan con los criterios de búsqueda.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Modal de detalle de habitación */}
      {habitacionSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Habitación {habitacionSeleccionada.numero} - {habitacionSeleccionada.tipo}
                </h2>
                <button
                  onClick={() => setHabitacionSeleccionada(null)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Información principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Número:</span>
                      <span className="font-semibold">{habitacionSeleccionada.numero}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tipo:</span>
                      <span className="font-semibold">{habitacionSeleccionada.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Piso:</span>
                      <span className="font-semibold">{habitacionSeleccionada.piso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(habitacionSeleccionada.estado)}`}>
                        {habitacionSeleccionada.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Limpieza</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Última limpieza:</span>
                      <span className="font-semibold">{habitacionSeleccionada.ultimaLimpieza}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Próxima limpieza:</span>
                      <span className="font-semibold">{habitacionSeleccionada.proximaLimpieza}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del huésped */}
              {habitacionSeleccionada.huespedActual && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Huésped Actual</h4>
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Nombre</p>
                        <p className="font-semibold text-gray-900">{habitacionSeleccionada.huespedActual}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-in</p>
                        <p className="font-semibold text-gray-900">{habitacionSeleccionada.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Check-out</p>
                        <p className="font-semibold text-gray-900">{habitacionSeleccionada.checkOut}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Servicios y características */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Servicios Incluidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {habitacionSeleccionada.servicios.map(servicio => (
                      <span key={servicio} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                        {getServicioNombre(servicio)}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Características</h4>
                  <div className="flex flex-wrap gap-2">
                    {habitacionSeleccionada.caracteristicas.map(caracteristica => (
                      <span key={caracteristica} className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm">
                        {caracteristica.split('-').join(' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notas */}
              {habitacionSeleccionada.notas && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Notas</h4>
                  <div className="bg-amber-50 rounded-2xl p-4">
                    <p className="text-sm text-gray-700">{habitacionSeleccionada.notas}</p>
                  </div>
                </div>
              )}

              {/* Acciones rápidas */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Acciones Rápidas</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors">
                    <Edit className="h-4 w-4 inline mr-2" />
                    Editar Información
                  </button>
                  <button className="bg-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-purple-600 transition-colors">
                    <span className="mr-2">🧹</span>
                    Programar Limpieza
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">
                    <span className="mr-2">🔧</span>
                    Reportar Problema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}