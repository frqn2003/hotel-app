'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowRightCircle,
  Users,
  Building,
  CalendarDays,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3,
  ShieldCheck
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
  estado: "Confirmada" | "Pendiente" | "Cancelada"
  huesped: string
  total: string
}

type Metricas = {
  ocupacion: string
  ingresos: string
  reservasHoy: number
  alertas: number
}

const metricasPanel = [
  {
    etiqueta: "Tasa de ocupación",
    valor: "78%",
    descripcion: "+5.2% vs mes anterior",
    icon: TrendingUp,
    tendencia: "positive"
  },
  {
    etiqueta: "Ingresos mensuales",
    valor: "$ 2.4M",
    descripcion: "Meta: $ 2.8M",
    icon: DollarSign,
    tendencia: "positive"
  },
  {
    etiqueta: "Reservas hoy",
    valor: "12",
    descripcion: "8 check-ins • 4 check-outs",
    icon: CalendarDays,
    tendencia: "neutral"
  },
  {
    etiqueta: "Alertas activas",
    valor: "3",
    descripcion: "Requieren atención inmediata",
    icon: AlertTriangle,
    tendencia: "negative"
  }
]

const reservasRecientes: Reserva[] = [
  {
    id: "R-87345",
    habitacion: "Suite Deluxe",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "15 Nov 2025",
    estado: "Confirmada",
    huesped: "María González",
    total: "$ 182.000"
  },
  {
    id: "R-87346",
    habitacion: "Habitación Ejecutiva",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "14 Nov 2025",
    estado: "Pendiente",
    huesped: "Carlos Rodríguez",
    total: "$ 120.000"
  },
  {
    id: "R-87347",
    habitacion: "Suite Presidencial",
    fechaEntrada: "13 Nov 2025",
    fechaSalida: "16 Nov 2025",
    estado: "Confirmada",
    huesped: "Ana Martínez",
    total: "$ 350.000"
  }
]

const alertasActivas = [
  {
    icon: AlertTriangle,
    titulo: "Mantenimiento Suite 301",
    descripcion: "Aire acondicionado requiere revisión urgente",
    prioridad: "alta"
  },
  {
    icon: Clock,
    titulo: "Check-in retrasado",
    descripcion: "Huésped R-87346 no ha realizado check-in",
    prioridad: "media"
  },
  {
    icon: Users,
    titulo: "Sobreocupación fin de semana",
    descripcion: "95% de ocupación prevista para el sábado",
    prioridad: "baja"
  }
]

const accionesRapidas = [
  {
    icon: Users,
    titulo: "Gestionar operadores",
    descripcion: "Crear y administrar el equipo de operadores",
    enlace: "/panel-admin/operadores"
  },
  {
    icon: Building,
    titulo: "Control de habitaciones",
    descripcion: "Estado y disponibilidad en tiempo real",
    enlace: "/panel-admin/habitaciones"
  },
  {
    icon: BarChart3,
    titulo: "Reportes financieros",
    descripcion: "Ingresos, métricas y análisis",
    enlace: "/panel-admin/reportes"
  },
  {
    icon: Settings,
    titulo: "Gestionar consultas",
    descripcion: "Responder y gestionar consultas de clientes",
    enlace: "/panel-admin/consultas"
  }
]

const habitacionesEstado = [
  {
    tipo: "Ocupadas",
    cantidad: "24",
    porcentaje: "60%",
    color: "bg-blue-500"
  },
  {
    tipo: "Disponibles",
    cantidad: "12",
    porcentaje: "30%",
    color: "bg-green-500"
  },
  {
    tipo: "Mantenimiento",
    cantidad: "4",
    porcentaje: "10%",
    color: "bg-amber-500"
  }
]

export default function PanelAdministrador() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      // Verificar que el usuario sea administrador
      if (userData.rol !== "ADMINISTRADOR" && userData.rol !== "OPERADOR") {
        // Redirigir si no tiene permisos
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
  }, [])

  const nombreUsuario = userSession?.nombre ?? "Administrador"

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
                  Panel de Administración
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Bienvenido, {nombreUsuario}
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Supervisa las operaciones del hotel, gestiona reservas y monitorea el rendimiento en tiempo real.
                </p>
              </div>
              <div className="flex gap-3">
                <a
                  href="/panel-admin/reportes"
                  className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md hover:bg-black/90 transition-all"
                >
                  Generar reporte
                  <BarChart3 className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            {/* Métricas principales */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {metricasPanel.map((dato) => {
                const Icono = dato.icon
                const colorTendencia = dato.tendencia === "positive" 
                  ? "text-emerald-600" 
                  : dato.tendencia === "negative" 
                    ? "text-red-600" 
                    : "text-gray-600"
                
                return (
                  <div
                    key={dato.etiqueta}
                    className="bg-[#F8FBFF] border border-gray-100 rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`h-11 w-11 rounded-full ${
                          dato.tendencia === "negative" ? "bg-red-500" : "bg-black/90"
                        } text-white flex items-center justify-center`}>
                          <Icono className="h-5 w-5" />
                        </span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">
                          {dato.etiqueta}
                        </span>
                      </div>
                    </div>
                    <p className="text-3xl font-semibold text-gray-900">{dato.valor}</p>
                    <p className={`text-sm ${colorTendencia}`}>{dato.descripcion}</p>
                  </div>
                )
              })}
            </div>

            {/* Estado de habitaciones */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Habitaciones</h3>
              <div className="flex flex-col gap-3">
                {habitacionesEstado.map((estado, index) => (
                  <div key={estado.tipo} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${estado.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{estado.tipo}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{estado.cantidad} habitaciones</span>
                      <span className="text-sm font-semibold text-gray-900">{estado.porcentaje}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contenido principal */}
          <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Reservas recientes */}
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reservas recientes</h2>
                  <p className="text-sm text-gray-500">Gestiona las reservas de hoy y los próximos días</p>
                </div>
                <a
                  href="/panel-admin/reservas"
                  className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Ver todas las reservas
                  <ArrowRightCircle className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {reservasRecientes.map((reserva) => (
                  <div key={reserva.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm uppercase tracking-widest text-gray-400">
                          {reserva.id}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reserva.estado === "Confirmada"
                              ? "bg-emerald-50 text-emerald-700"
                              : reserva.estado === "Pendiente"
                                ? "bg-amber-50 text-amber-700"
                                : "bg-red-50 text-red-600"
                          }`}
                        >
                          {reserva.estado}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{reserva.habitacion}</p>
                      <p className="text-sm text-gray-600">Huésped: {reserva.huesped}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          Check-in: {reserva.fechaEntrada}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-out: {reserva.fechaSalida}
                        </span>
                        <span className="inline-flex items-center gap-2 font-semibold text-gray-900">
                          <DollarSign className="h-4 w-4" />
                          {reserva.total}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <a
                        href="#"
                        className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        Gestionar
                        <ArrowRightCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alertas y notificaciones */}
            <aside className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Alertas activas</h2>
                <p className="text-sm text-gray-500">Situaciones que requieren tu atención</p>
              </div>
              <div className="flex flex-col gap-4">
                {alertasActivas.map((alerta) => {
                  const Icono = alerta.icon
                  const colorPrioridad = alerta.prioridad === "alta" 
                    ? "bg-red-500" 
                    : alerta.prioridad === "media" 
                      ? "bg-amber-500" 
                      : "bg-blue-500"
                  
                  return (
                    <div
                      key={alerta.titulo}
                      className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-10 w-10 rounded-full ${colorPrioridad} text-white flex items-center justify-center`}>
                          <Icono className="h-5 w-5" />
                        </span>
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-gray-900">{alerta.titulo}</p>
                          <p className="text-sm text-gray-500">{alerta.descripcion}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          alerta.prioridad === "alta" 
                            ? "bg-red-100 text-red-700"
                            : alerta.prioridad === "media"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-blue-100 text-blue-700"
                        }`}>
                          {alerta.prioridad.toUpperCase()}
                        </span>
                        <button className="text-sm font-medium text-black hover:text-gray-700 transition-colors">
                          Resolver
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <a
                href="/panel-admin/alertas"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-black px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                Ver todas las alertas
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </aside>
          </section>

          {/* Acciones rápidas */}
          <section className="grid gap-8">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Acciones rápidas</h2>
                <p className="text-sm text-gray-500">Accede a las herramientas de gestión principales</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {accionesRapidas.map((accion) => {
                  const Icono = accion.icon
                  return (
                    <a
                      key={accion.titulo}
                      href={accion.enlace}
                      className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:border-gray-300 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center group-hover:bg-black transition-all">
                          <Icono className="h-6 w-6" />
                        </span>
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-semibold text-gray-900">{accion.titulo}</p>
                          <p className="text-sm text-gray-500">{accion.descripcion}</p>
                        </div>
                      </div>
                    </a>
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