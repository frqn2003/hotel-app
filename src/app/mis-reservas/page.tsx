'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { useReservas } from '@/hooks/useReservas'
import { CalendarDays, Clock, MapPin, ArrowRightCircle, AlertCircle, RefreshCw } from 'lucide-react'

type UserSession = {
  id: string
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

export default function MisReservas() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      setUserSession(JSON.parse(session))
    }
    setIsLoadingSession(false)
  }, [])

  const userId = userSession?.id ?? ''
  // Solo cargar reservas si ya se cargó la sesión y hay userId
  const { reservas, loading, error, cargarReservas } = useReservas(
    !isLoadingSession && userId ? { userId } : undefined
  )

  // Recargar cuando vuelve a la página
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userId) {
        cargarReservas()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [cargarReservas, userId])

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CHECKIN: 'bg-blue-50 text-blue-700 border-blue-200',
      CHECKOUT: 'bg-gray-50 text-gray-700 border-gray-200',
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
      CANCELADA: 'bg-red-50 text-red-700 border-red-200'
    }
    return colores[estado] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getEstadoTexto = (estado: string) => {
    const textos: Record<string, string> = {
      CONFIRMADA: 'Confirmada',
      CHECKIN: 'Check-in realizado',
      CHECKOUT: 'Finalizada',
      PENDIENTE: 'Pendiente',
      CANCELADA: 'Cancelada'
    }
    return textos[estado] || estado
  }

  // Filtrar reservas
  const reservasActivas = reservas.filter(r => 
    ['CONFIRMADA', 'CHECKIN', 'PENDIENTE'].includes(r.estado)
  )
  const reservasPasadas = reservas.filter(r => 
    ['CHECKOUT', 'CANCELADA'].includes(r.estado)
  )

  // Mostrar loading mientras se carga la sesión
  if (isLoadingSession) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] min-h-screen py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
            </div>
            <p className="text-lg font-medium text-gray-900">Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Mis Reservas
                </h1>
                <p className="text-base text-gray-600">
                  Historial completo de tus estadías en Next Lujos
                </p>
              </div>
              <button
                onClick={() => cargarReservas()}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                title="Actualizar reservas"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {loading && reservas.length > 0 ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && reservas.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-gray-200"></div>
                  <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">Cargando tus reservas</p>
                  <p className="text-sm text-gray-500 mt-1">Esto solo tomará un momento...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Error al cargar reservas</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Reservas Activas */}
          {!loading && !error && reservasActivas.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Reservas Activas
                </h2>
                <p className="text-sm text-gray-500">
                  {reservasActivas.length} reserva{reservasActivas.length !== 1 ? 's' : ''} próxima{reservasActivas.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col divide-y divide-gray-100">
                {reservasActivas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-xs uppercase tracking-widest text-gray-400">
                        {reserva.id}
                      </span>
                      <p className="text-xl font-semibold text-gray-900">
                        {reserva.room?.tipo || 'Habitación'} - #{reserva.room?.numero || '---'}
                      </p>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(reserva.fechaEntrada).toLocaleDateString('es-AR')}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Check-out {new Date(reserva.fechaSalida).toLocaleDateString('es-AR')}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {reserva.huespedes} huésped{reserva.huespedes > 1 ? 'es' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center md:flex-col gap-4 md:gap-3">
                      <span className={`px-5 py-2 rounded-full text-sm font-medium border ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                      <a
                        href={`/mis-reservas/${reserva.id}`}
                        className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-black/90 transition-all"
                      >
                        Ver Detalles
                        <ArrowRightCircle className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reservas Pasadas */}
          {!loading && !error && reservasPasadas.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Historial
                </h2>
                <p className="text-sm text-gray-500">
                  {reservasPasadas.length} reserva{reservasPasadas.length !== 1 ? 's' : ''} completada{reservasPasadas.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {reservasPasadas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="border border-gray-200 rounded-2xl p-6 flex flex-col gap-3 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-400 uppercase tracking-wide">
                          {reserva.id}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {reserva.room?.tipo || 'Habitación'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reserva.estado)}`}>
                        {getEstadoTexto(reserva.estado)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(reserva.fechaEntrada).toLocaleDateString('es-AR')} - {new Date(reserva.fechaSalida).toLocaleDateString('es-AR')}
                      </span>
                    </div>

                    <a
                      href={`/mis-reservas/${reserva.id}`}
                      className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all mt-2"
                    >
                      Ver Detalles
                      <ArrowRightCircle className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sin reservas */}
          {!loading && !error && reservas.length === 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-12 text-center">
              <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No tienes reservas
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza a planear tu próxima estadía en Next Lujos
              </p>
              <a
                href="/reserva"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all"
              >
                Reservar Ahora
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
