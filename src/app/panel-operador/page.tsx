'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import ConsultasPendientes from "@/componentes/PanelOperador/ConsultasPendientes"
import ActividadesRecientes from "@/componentes/PanelOperador/ActividadesRecientes"
import EstadisticasPagos from "@/componentes/PanelOperador/EstadisticasPagos"
import MetricasDashboard from "@/componentes/PanelOperador/MetricasDashboard"
import ReservasHoy from "@/componentes/PanelOperador/ReservasHoy"
import {
  ArrowRightCircle,
  Users,
  Building,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Phone,
  MessageCircle,
  UserCheck,
  Key,
  Receipt
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type Reserva = {
  id: string
  habitacion: string
  fechaEntrada: string
  fechaSalida: string
  estado: "Check-in Pendiente" | "Activa" | "Check-out Pendiente" | "Finalizada"
  huesped: string
  telefono: string
  checkIn: string
  checkOut: string
}

type Tarea = {
  id: string
  titulo: string
  tipo: "checkin" | "checkout" | "limpieza" | "mantenimiento"
  habitacion: string
  hora: string
  prioridad: "alta" | "media" | "baja"
}

const metricasPanel = [
  {
    etiqueta: "Check-ins hoy",
    valor: "8",
    descripcion: "5 completados • 3 pendientes",
    icon: UserCheck,
    tendencia: "neutral"
  },
  {
    etiqueta: "Check-outs hoy",
    valor: "6",
    descripcion: "4 completados • 2 pendientes",
    icon: Key,
    tendencia: "neutral"
  },
  {
    etiqueta: "Habitaciones ocupadas",
    valor: "24",
    descripcion: "85% de ocupación actual",
    icon: Building,
    tendencia: "positive"
  },
  {
    etiqueta: "Tareas pendientes",
    valor: "7",
    descripcion: "3 requieren atención urgente",
    icon: AlertTriangle,
    tendencia: "negative"
  }
]

const reservasHoy: Reserva[] = [
  {
    id: "R-87345",
    habitacion: "Suite Deluxe (301)",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "15 Nov 2025",
    estado: "Activa",
    huesped: "María González",
    telefono: "+54 11 2345-6789",
    checkIn: "14:00",
    checkOut: "12:00"
  },
  {
    id: "R-87346",
    habitacion: "Habitación Ejecutiva (204)",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "14 Nov 2025",
    estado: "Check-in Pendiente",
    huesped: "Carlos Rodríguez",
    telefono: "+54 11 3456-7890",
    checkIn: "15:30",
    checkOut: "11:00"
  },
  {
    id: "R-87347",
    habitacion: "Suite Presidencial (401)",
    fechaEntrada: "13 Nov 2025",
    fechaSalida: "16 Nov 2025",
    estado: "Check-out Pendiente",
    huesped: "Ana Martínez",
    telefono: "+54 11 4567-8901",
    checkIn: "16:00",
    checkOut: "10:00"
  }
]

const tareasPendientes: Tarea[] = [
  {
    id: "T-001",
    titulo: "Check-in pendiente",
    tipo: "checkin",
    habitacion: "204",
    hora: "15:30",
    prioridad: "alta"
  },
  {
    id: "T-002",
    titulo: "Limpieza suite",
    tipo: "limpieza",
    habitacion: "301",
    hora: "12:00",
    prioridad: "media"
  },
  {
    id: "T-003",
    titulo: "Check-out programado",
    tipo: "checkout",
    habitacion: "401",
    hora: "10:00",
    prioridad: "alta"
  },
  {
    id: "T-004",
    titulo: "Mantenimiento AA",
    tipo: "mantenimiento",
    habitacion: "105",
    hora: "16:00",
    prioridad: "media"
  }
]

const habitacionesEstado = [
  {
    habitacion: "301 - Suite Deluxe",
    estado: "Ocupada",
    huesped: "María González",
    checkOut: "15 Nov • 12:00",
    limpieza: "Pendiente",
    icon: Building
  },
  {
    habitacion: "204 - Ejecutiva",
    estado: "Check-in Pendiente",
    huesped: "Carlos Rodríguez",
    checkOut: "14 Nov • 11:00",
    limpieza: "Lista",
    icon: Clock
  },
  {
    habitacion: "401 - Presidencial",
    estado: "Ocupada",
    huesped: "Ana Martínez",
    checkOut: "16 Nov • 10:00",
    limpieza: "En progreso",
    icon: UserCheck
  }
]

const accionesRapidas = [
  {
    icon: CalendarDays,
    titulo: "Gestionar Reservas",
    descripcion: "Check-in y Check-out rápido",
    enlace: "/panel-operador/gestionar-reservas",
    color: "bg-black"
  },
  {
    icon: Receipt,
    titulo: "Gestión de facturas",
    descripcion: "Emitir y consultar facturas",
    enlace: "/panel-operador/facturacion",
    color: "bg-purple-500"
  },
  {
    icon: Building,
    titulo: "Estado habitaciones",
    descripcion: "Ver disponibilidad en tiempo real",
    enlace: "/panel-operador/habitaciones",
    color: "bg-amber-500"
  },
  {
    icon: MessageCircle,
    titulo: "Consultas",
    descripcion: "Gestionar mensajes de clientes",
    enlace: "/panel-operador/consultas",
    color: "bg-blue-500"
  }
]

const contactosUrgentes = [
  {
    departamento: "Mantenimiento",
    telefono: "+54 11 5000-1001",
    extension: "101",
    icon: Settings
  },
  {
    departamento: "Limpieza",
    telefono: "+54 11 5000-1002",
    extension: "102",
    icon: Building
  },
  {
    departamento: "Gerencia",
    telefono: "+54 11 5000-1000",
    extension: "100",
    icon: Users
  }
]

export default function PanelOperador() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [horaActual, setHoraActual] = useState<string>("")

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      // Verificar que el usuario sea operador o admin
      if (userData.rol !== "OPERADOR" && userData.rol !== "ADMIN") {
        window.location.href = "/panel"
        return
      }
      setUserSession(userData)
    }

    // Actualizar hora actual
    const actualizarHora = () => {
      const now = new Date()
      setHoraActual(now.toLocaleTimeString('es-AR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }

    actualizarHora()
    const interval = setInterval(actualizarHora, 1000)
    return () => clearInterval(interval)
  }, [])

  const nombreUsuario = userSession?.nombre ?? "Operador"

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-emerald-50 text-emerald-700"
      case "Check-in Pendiente":
        return "bg-amber-50 text-amber-700"
      case "Check-out Pendiente":
        return "bg-blue-50 text-blue-700"
      case "Finalizada":
        return "bg-gray-50 text-gray-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getTareaIcon = (tipo: string) => {
    switch (tipo) {
      case "checkin":
        return UserCheck
      case "checkout":
        return Key
      case "limpieza":
        return Building
      case "mantenimiento":
        return Settings
      default:
        return AlertTriangle
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "bg-red-100 text-red-700"
      case "media":
        return "bg-amber-100 text-amber-700"
      case "baja":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16">
        <div className="contenedor flex flex-col gap-12">
          {/* Header y Métricas */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Panel de Operaciones
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Buen día, {nombreUsuario}
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Gestiona check-ins, check-outs y atiende las necesidades de los huéspedes en tiempo real.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-2xl font-semibold text-gray-900">
                  {horaActual}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
            
            {/* Métricas principales */}
            <MetricasDashboard />

            {/* Acciones rápidas */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-4">
              {accionesRapidas.map((accion) => {
                const Icono = accion.icon
                return (
                  <a
                    key={accion.titulo}
                    href={accion.enlace}
                    className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 hover:border-gray-300 transition-all group"
                  >
                    <span className={`h-12 w-12 rounded-full ${accion.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icono className="h-6 w-6" />
                    </span>
                    <div className="flex flex-col">
                      <p className="text-base font-semibold text-gray-900">{accion.titulo}</p>
                      <p className="text-sm text-gray-500">{accion.descripcion}</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </section>

          {/* Contenido principal */}
          <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Reservas de hoy con datos reales */}
            <ReservasHoy />

            {/* Tareas pendientes - Componente original comentado para evitar duplicación */}
            {/* <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reservas de hoy</h2>
                  <p className="text-sm text-gray-500">Gestiona las llegadas y salidas programadas</p>
                </div>
                <a
                  href="/panel-operador/reservas"
                  className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Ver calendario completo
                  <ArrowRightCircle className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {reservasHoy.map((reserva) => (
                  <div key={reserva.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm uppercase tracking-widest text-gray-400">
                          {reserva.id}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                          {reserva.estado}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{reserva.habitacion}</p>
                      <p className="text-sm text-gray-600">{reserva.huesped}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {reserva.telefono}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-in: {reserva.checkIn}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Check-out: {reserva.checkOut}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {reserva.estado === "Check-in Pendiente" && (
                        <button className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors">
                          <UserCheck className="h-4 w-4" />
                          Check-in
                        </button>
                      )}
                      {reserva.estado === "Check-out Pendiente" && (
                        <button className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                          <Key className="h-4 w-4" />
                          Check-out
                        </button>
                      )}
                      <a
                        href="#"
                        className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        Detalles
                        <ArrowRightCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tareas pendientes */}
            <aside className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Tareas pendientes</h2>
                <p className="text-sm text-gray-500">Acciones requeridas para hoy</p>
              </div>
              <div className="flex flex-col gap-4">
                {tareasPendientes.map((tarea) => {
                  const IconoTarea = getTareaIcon(tarea.tipo)
                  return (
                    <div
                      key={tarea.id}
                      className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-3 hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="h-10 w-10 rounded-full bg-black/90 text-white flex items-center justify-center">
                            <IconoTarea className="h-5 w-5" />
                          </span>
                          <div className="flex flex-col">
                            <p className="text-base font-semibold text-gray-900">{tarea.titulo}</p>
                            <p className="text-sm text-gray-500">Habitación {tarea.habitacion}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPrioridadColor(tarea.prioridad)}`}>
                          {tarea.prioridad}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {tarea.hora}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-emerald-600 hover:text-emerald-700 transition-colors">
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <a
                href="/panel-operador/tareas"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-black px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                Ver todas las tareas
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </aside>
          </section>

          {/* Información adicional */}
          <section className="grid gap-8 lg:grid-cols-2">
            {/* Consultas pendientes */}
            <ConsultasPendientes />

            {/* Actividades recientes */}
            <ActividadesRecientes />
          </section>

          {/* Estadísticas de pagos */}
          <section>
            <EstadisticasPagos />
          </section>

          {/* Estado de habitaciones */}
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Estado de habitaciones</h2>
                <p className="text-sm text-gray-500">Situación actual de las habitaciones clave</p>
              </div>
              <div className="flex flex-col gap-4">
                {habitacionesEstado.map((hab) => {
                  const Icono = hab.icon
                  return (
                    <div
                      key={hab.habitacion}
                      className="border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-gray-200 transition-all"
                    >
                      <span className="h-11 w-11 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Icono className="h-5 w-5" />
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-base font-semibold text-gray-900">{hab.habitacion}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            hab.estado === "Ocupada" 
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}>
                            {hab.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Huésped: {hab.huesped}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Check-out: {hab.checkOut}</span>
                          <span>Limpieza: {hab.limpieza}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contactos urgentes */}
            <div className="bg-black text-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Contactos urgentes</h2>
                <p className="text-sm text-white/70">
                  Números internos para situaciones que requieren atención inmediata.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                {contactosUrgentes.map((contacto) => {
                  const Icono = contacto.icon
                  return (
                    <div key={contacto.departamento} className="flex flex-col gap-3 p-4 bg-white/10 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Icono className="h-5 w-5" />
                        <span className="font-semibold">{contacto.departamento}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white/80">{contacto.telefono}</span>
                        <span className="text-sm bg-white/20 px-2 py-1 rounded">Ext. {contacto.extension}</span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${contacto.telefono}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-all text-sm"
                        >
                          <Phone className="h-4 w-4" />
                          Llamar
                        </a>
                        <a
                          href={`sms:${contacto.telefono}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 border border-white/50 hover:border-white px-4 py-2 rounded-lg transition-all text-sm"
                        >
                          <MessageCircle className="h-4 w-4" />
                          SMS
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}