'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Edit,
  Bed,
  Wifi,
  Tv,
  Coffee,
  Users,
  MapPin,
  Image as ImageIcon,
  Loader,
  AlertCircle,
  CheckCircle,
  User,
  Clock,
  XCircle,
  RefreshCw,
  Home
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
  comodidades?: string[] | string
  imagen?: string
  lat?: number
  lng?: number
  createdAt: string
  updatedAt: string
}

export default function DetalleHabitacion() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR" && userData.rol !== "OPERADOR") {
        router.push("/panel-usuario")
        return
      }
      setUserSession(userData)
    } else {
      router.push("/auth/login")
      return
    }

    if (id) {
      fetchHabitacion()
    }
  }, [id])

  const fetchHabitacion = async () => {
    try {
      setLoading(true)
      
      // Backend deshabilitado - Datos mock
      await new Promise(resolve => setTimeout(resolve, 400))
      
      const habitacionesMock: Habitacion[] = [
        {
          id: '1',
          numero: 101,
          tipo: 'SIMPLE',
          precio: 50000,
          descripcion: 'Habitación simple con cama individual',
          capacidad: 1,
          estado: 'DISPONIBLE',
          comodidades: ['WiFi', 'TV', 'Aire Acondicionado'],
          imagen: '/placeholder-room.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          numero: 102,
          tipo: 'DOBLE',
          precio: 80000,
          descripcion: 'Habitación doble con cama matrimonial',
          capacidad: 2,
          estado: 'OCUPADA',
          comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'],
          imagen: '/placeholder-room.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      const habitacionEncontrada = habitacionesMock.find(h => h.id === id)
      
      if (habitacionEncontrada) {
        setHabitacion(habitacionEncontrada)
      } else {
        setError("Habitación no encontrada")
      }
    } catch (err) {
      setError("Error al cargar habitación")
      console.error(err)
    } finally {
      setLoading(false)
    }
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
        return <CheckCircle className="h-5 w-5" />
      case "OCUPADA":
        return <User className="h-5 w-5" />
      case "RESERVADA":
        return <Clock className="h-5 w-5" />
      case "LIMPIEZA":
        return <RefreshCw className="h-5 w-5" />
      case "MANTENIMIENTO":
        return <XCircle className="h-5 w-5" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const getEstadoDescripcion = (estado: string) => {
    switch (estado) {
      case "DISPONIBLE":
        return "La habitación está lista para ser reservada por nuevos huéspedes."
      case "OCUPADA":
        return "La habitación actualmente tiene huéspedes alojados."
      case "RESERVADA":
        return "La habitación tiene una reserva confirmada y estará ocupada pronto."
      case "LIMPIEZA":
        return "La habitación está en proceso de limpieza después del checkout."
      case "MANTENIMIENTO":
        return "La habitación requiere reparaciones o mantenimiento temporal."
      default:
        return "Estado desconocido."
    }
  }

  const getComodidadesArray = (comodidades: string[] | string | undefined): string[] => {
    if (!comodidades) return []
    if (Array.isArray(comodidades)) return comodidades
    return comodidades.split(" ").filter(Boolean)
  }

  if (loading) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] py-16 min-h-screen">
          <div className="contenedor">
            <div className="flex items-center justify-center py-16">
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error && !habitacion) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] py-16 min-h-screen">
          <div className="contenedor">
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/panel-admin/habitaciones"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a habitaciones
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">
                Habitación #{habitacion?.numero}
              </h1>
              <p className="text-gray-600">Detalles completos de la habitación</p>
            </div>
            {userSession?.rol === "ADMINISTRADOR" && (
              <Link
                href={`/panel-admin/habitaciones/${id}/editar`}
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
              >
                <Edit className="h-5 w-5" />
                Editar
              </Link>
            )}
          </div>

          {habitacion && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Columna principal - Información */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tarjeta principal */}
                <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  {/* Imagen */}
                  {habitacion.imagen ? (
                    <div className="h-64 bg-gray-100">
                      <img
                        src={habitacion.imagen}
                        alt={`Habitación ${habitacion.numero}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/800x400?text=Imagen+no+disponible"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Sin imagen disponible</p>
                      </div>
                    </div>
                  )}

                  {/* Información básica */}
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Habitación #{habitacion.numero}
                        </h2>
                        <p className="text-lg text-gray-600">{habitacion.tipo}</p>
                      </div>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getEstadoColor(habitacion.estado)}`}>
                        {getEstadoIcon(habitacion.estado)}
                        {habitacion.estado}
                      </span>
                    </div>

                    {/* Descripción del estado */}
                    <div className={`p-4 rounded-xl mb-6 ${getEstadoColor(habitacion.estado)}`}>
                      <p className="text-sm">{getEstadoDescripcion(habitacion.estado)}</p>
                    </div>

                    {/* Detalles principales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Capacidad</p>
                        <p className="text-xl font-bold text-gray-900">{habitacion.capacidad} personas</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Bed className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Precio por noche</p>
                        <p className="text-xl font-bold text-gray-900">${habitacion.precio.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <Home className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-1">Tipo</p>
                        <p className="text-xl font-bold text-gray-900">{habitacion.tipo}</p>
                      </div>
                    </div>

                    {/* Descripción */}
                    {habitacion.descripcion && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                        <p className="text-gray-700 leading-relaxed">{habitacion.descripcion}</p>
                      </div>
                    )}

                    {/* Comodidades */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Comodidades y Servicios</h3>
                      <div className="flex flex-wrap gap-2">
                        {getComodidadesArray(habitacion.comodidades).map((comodidad, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                          >
                            {comodidad.toLowerCase().includes('wifi') && <Wifi className="h-4 w-4" />}
                            {comodidad.toLowerCase().includes('tv') && <Tv className="h-4 w-4" />}
                            {comodidad.toLowerCase().includes('aire') && <RefreshCw className="h-4 w-4" />}
                            {comodidad.toLowerCase().includes('minibar') && <Coffee className="h-4 w-4" />}
                            {comodidad}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de ubicación */}
                {(habitacion.lat || habitacion.lng) && (
                  <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Ubicación
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Latitud</p>
                        <p className="font-medium text-gray-900">{habitacion.lat || "No especificada"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Longitud</p>
                        <p className="font-medium text-gray-900">{habitacion.lng || "No especificada"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna lateral - Información adicional */}
              <div className="space-y-8">
                {/* Estado actual */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h3>
                  <div className="space-y-3">
                    <div className={`p-4 rounded-xl border ${getEstadoColor(habitacion.estado)}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {getEstadoIcon(habitacion.estado)}
                        <span className="font-medium">{habitacion.estado}</span>
                      </div>
                      <p className="text-sm">{getEstadoDescripcion(habitacion.estado)}</p>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="bg-white rounded-3xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Registro</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Fecha de creación</p>
                      <p className="font-medium text-gray-900">
                        {new Date(habitacion.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {habitacion.updatedAt && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Última actualización</p>
                        <p className="font-medium text-gray-900">
                          {new Date(habitacion.updatedAt).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones rápidas */}
                {userSession?.rol === "ADMINISTRADOR" && (
                  <div className="bg-white rounded-3xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="space-y-3">
                      <a
                        href={`/panel-admin/habitaciones/${id}/editar`}
                        className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors text-center inline-block"
                      >
                        <Edit className="h-4 w-4 inline mr-2" />
                        Editar Habitación
                      </a>
                      <button
                        onClick={() => window.history.back()}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                      >
                        <ArrowLeft className="h-4 w-4 inline mr-2" />
                        Volver
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
