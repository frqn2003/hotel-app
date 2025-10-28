'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowRightCircle,
  Bell,
  CalendarDays,
  Clock,
  CreditCard,
  LifeBuoy,
  MapPin,
  Settings,
  ShieldCheck,
  Star
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO"
}

type Reserva = {
  id: string
  habitacion: string
  fechaEntrada: string
  fechaSalida: string
  estado: "Confirmada" | "Pendiente" | "Cancelada"
}

const resumenPanel = [
  {
    etiqueta: "Reservas activas",
    valor: "2",
    descripcion: "Tus próximas estancias",
    icon: CalendarDays
  },
  {
    etiqueta: "Puntos disponibles",
    valor: "1.240",
    descripcion: "Programa Recompensas Next Lujos",
    icon: Star
  },
  {
    etiqueta: "Último pago",
    valor: "$ 182.000",
    descripcion: "Suite Deluxe • 10 Oct 2025",
    icon: CreditCard
  }
]

const reservasRecientes: Reserva[] = [
  {
    id: "R-87345",
    habitacion: "Suite Deluxe",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "15 Nov 2025",
    estado: "Confirmada"
  },
  {
    id: "R-87211",
    habitacion: "Loft Ejecutivo",
    fechaEntrada: "04 Dic 2025",
    fechaSalida: "07 Dic 2025",
    estado: "Pendiente"
  }
]

const beneficiosDisponibles = [
  {
    icon: ShieldCheck,
    titulo: "Check-in prioritario",
    descripcion: "Accede a una recepción exclusiva y evita filas en tu llegada."
  },
  {
    icon: Bell,
    titulo: "Concierge 24/7",
    descripcion: "Un asistente personal disponible en todo momento para tus solicitudes."
  },
  {
    icon: Star,
    titulo: "Upgrade garantizado",
    descripcion: "Recibe una categoría superior cuando haya disponibilidad."
  }
]

const accionesRapidas = [
  {
    icon: CalendarDays,
    titulo: "Reservar nueva estadía",
    descripcion: "Elige habitación, fechas y huéspedes en minutos",
    enlace: "/reserva"
  },
  {
    icon: Settings,
    titulo: "Gestionar preferencias",
    descripcion: "Actualiza métodos de pago y solicitudes especiales",
    enlace: "/panel-usuario/preferencias"
  },
  {
    icon: ShieldCheck,
    titulo: "Seguridad de la cuenta",
    descripcion: "Activa verificaciones y revisa accesos recientes",
    enlace: "panel-usuario/seguridad"
  }
]

const recomendaciones = [
  {
    titulo: "Tour gastronómico por Recoleta",
    detalle: "16 Nov 2025 · Salida desde lobby",
    icon: MapPin
  },
  {
    titulo: "Acceso al spa y circuito hídrico",
    detalle: "Incluido con tu próxima reserva",
    icon: Clock
  },
  {
    titulo: "Cóctel de bienvenida en Sky Bar",
    detalle: "Disponible el día del check-in",
    icon: Star
  }
]

export default function PanelUsuario() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      setUserSession(JSON.parse(session))
    }
  }, [])

  const nombreUsuario = userSession?.nombre ?? "Invitado"

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16">
        <div className="contenedor flex flex-col gap-12">
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Panel del huésped
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Hola, {nombreUsuario}
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Gestiona reservas, personaliza tu estadía y accede a beneficios exclusivos de Next Lujos.
                </p>
              </div>
              <a
                href="/reserva"
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md hover:bg-black/90 transition-all"
              >
                Gestionar próxima reserva
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {resumenPanel.map((dato) => {
                const Icono = dato.icon
                return (
                  <div
                    key={dato.etiqueta}
                    className="bg-[#F8FBFF] border border-gray-100 rounded-2xl p-6 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="h-11 w-11 rounded-full bg-black/90 text-white flex items-center justify-center">
                          <Icono className="h-5 w-5" />
                        </span>
                        <span className="text-xs uppercase tracking-widest text-gray-500">
                          {dato.etiqueta}
                        </span>
                      </div>
                    </div>
                    <p className="text-3xl font-semibold text-gray-900">{dato.valor}</p>
                    <p className="text-sm text-gray-500">{dato.descripcion}</p>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reservas recientes</h2>
                  <p className="text-sm text-gray-500">Consultá el detalle de tus próximas estadías</p>
                </div>
                <a
                  href="/reserva"
                  className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Ver historial completo
                  <ArrowRightCircle className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-col divide-y divide-gray-100">
                {reservasRecientes.map((reserva) => (
                  <div key={reserva.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm uppercase tracking-widest text-gray-400">
                        {reserva.id}
                      </span>
                      <p className="text-lg font-semibold text-gray-900">{reserva.habitacion}</p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {reserva.fechaEntrada}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-out {reserva.fechaSalida}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center md:flex-col gap-4 md:gap-2">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          reserva.estado === "Confirmada"
                            ? "bg-emerald-50 text-emerald-700"
                            : reserva.estado === "Pendiente"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-600"
                        }`}
                      >
                        {reserva.estado}
                      </span>
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

            <aside className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Beneficios activos</h2>
                <p className="text-sm text-gray-500">Disfrutá ventajas disponibles en tu categoría</p>
              </div>
              <div className="flex flex-col gap-4">
                {beneficiosDisponibles.map((beneficio) => {
                  const Icono = beneficio.icon
                  return (
                    <div
                      key={beneficio.titulo}
                      className="border border-gray-100 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full bg-black/90 text-white flex items-center justify-center">
                          <Icono className="h-5 w-5" />
                        </span>
                        <p className="text-base font-semibold text-gray-900">{beneficio.titulo}</p>
                      </div>
                      <p className="text-sm text-gray-500">{beneficio.descripcion}</p>
                    </div>
                  )
                })}
              </div>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-black px-5 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
              >
                Conocer más beneficios
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </aside>
          </section>

          <section className="grid gap-8 lg:grid-cols-3">
            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Acciones rápidas</h2>
                <p className="text-sm text-gray-500">Accede a gestiones frecuentes en un clic</p>
              </div>
              <div className="flex flex-col gap-4">
                {accionesRapidas.map((accion) => {
                  const Icono = accion.icon
                  return (
                    <a
                      key={accion.titulo}
                      href={accion.enlace}
                      className="border border-gray-100 rounded-2xl p-5 flex items-start gap-4 hover:border-gray-300 transition-all"
                    >
                      <span className="h-11 w-11 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Icono className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-semibold text-gray-900">{accion.titulo}</p>
                        <p className="text-sm text-gray-500">{accion.descripcion}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Experiencias sugeridas</h2>
                <p className="text-sm text-gray-500">Sumá actividades personalizadas a tu estadía</p>
              </div>
              <div className="flex flex-col gap-4">
                {recomendaciones.map((recomendacion) => {
                  const Icono = recomendacion.icon
                  return (
                    <div
                      key={recomendacion.titulo}
                      className="border border-gray-100 rounded-2xl p-5 flex items-start gap-4"
                    >
                      <span className="h-11 w-11 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Icono className="h-5 w-5" />
                      </span>
                      <div className="flex flex-col">
                        <p className="text-base font-semibold text-gray-900">{recomendacion.titulo}</p>
                        <p className="text-sm text-gray-500">{recomendacion.detalle}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-black text-white rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Necesitás ayuda inmediata</h2>
                <p className="text-sm text-white/70">
                  Nuestro equipo de Concierge está disponible para ayudarte con cambios, solicitudes especiales o recomendaciones.
                </p>
              </div>
              <div className="flex flex-col gap-4 text-sm text-white/80">
                <div className="flex items-center gap-3">
                  <LifeBuoy className="h-5 w-5" />
                  Soporte integral 24/7
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5" />
                  Alertas en tiempo real sobre tu estadía
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5" />
                  Seguridad y privacidad certificada
                </div>
              </div>
              <a
                href="tel:+541145550000"
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-all"
              >
                Contactar Concierge
                <ArrowRightCircle className="h-4 w-4" />
              </a>
              <a
                href="mailto:concierge@nextlujos.com"
                className="inline-flex items-center justify-center gap-2 border border-white/50 hover:border-white px-6 py-3 rounded-xl transition-all text-sm"
              >
                Enviar mensaje
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}