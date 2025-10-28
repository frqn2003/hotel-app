'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { reservaService } from '@/services/reserva.service'
import type { Reserva } from '@/types'
import {
  CalendarDays,
  LogIn,
  LogOut,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

export default function GestionarReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [procesando, setProcesando] = useState<string | null>(null)

  const cargarReservas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await reservaService.obtenerReservas()

      if (response.success && response.data) {
        // Ordenar por fecha de entrada
        const reservasOrdenadas = response.data.sort((a, b) =>
          new Date(a.fechaEntrada).getTime() - new Date(b.fechaEntrada).getTime()
        )
        setReservas(reservasOrdenadas)
      } else {
        setError('Error al cargar reservas')
      }
    } catch (err) {
      setError('Error al cargar reservas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReservas()
  }, [])

  const hacerCheckin = async (id: string) => {
    try {
      setProcesando(id)
      const response = await reservaService.hacerCheckin(id)

      if (response.success) {
        await cargarReservas()
      } else {
        alert(response.message || 'Error al hacer check-in')
      }
    } catch (err) {
      alert('Error al hacer check-in')
    } finally {
      setProcesando(null)
    }
  }

  const hacerCheckout = async (id: string) => {
    try {
      setProcesando(id)
      const response = await reservaService.hacerCheckout(id)

      if (response.success) {
        await cargarReservas()
      } else {
        alert(response.message || 'Error al hacer check-out')
      }
    } catch (err) {
      alert('Error al hacer check-out')
    } finally {
      setProcesando(null)
    }
  }

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      CONFIRMADA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      CHECKIN: 'bg-blue-50 text-blue-700 border-blue-200',
      CHECKOUT: 'bg-gray-50 text-gray-700 border-gray-200',
      PENDIENTE: 'bg-amber-50 text-amber-700 border-amber-200',
      CANCELADA: 'bg-red-50 text-red-700 border-red-200',
      NO_SHOW: 'bg-purple-50 text-purple-700 border-purple-200'
    }
    return colores[estado] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getEstadoTexto = (estado: string) => {
    const textos: Record<string, string> = {
      CONFIRMADA: 'Confirmada',
      CHECKIN: 'En Hotel',
      CHECKOUT: 'Finalizada',
      PENDIENTE: 'Pendiente',
      CANCELADA: 'Cancelada',
      NO_SHOW: 'No Show'
    }
    return textos[estado] || estado
  }

  // Filtrar reservas por estado
  const reservasConfirmadas = reservas.filter(r => r.estado === 'CONFIRMADA')
  const reservasEnHotel = reservas.filter(r => r.estado === 'CHECKIN')
  const reservasPendientes = reservas.filter(r => r.estado === 'PENDIENTE')

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <a
                  href="/panel-operador"
                  className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Volver al panel
                </a>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Gestionar Reservas
                </h1>
                <p className="text-base text-gray-600 mt-2">
                  Check-in, Check-out y gestión de estados
                </p>
              </div>
              <button
                onClick={cargarReservas}
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && reservas.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando reservas...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Stats Cards */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                <p className="text-sm text-amber-700 font-medium">Pendientes de Pago</p>
                <p className="text-4xl font-bold text-amber-900 mt-2">{reservasPendientes.length}</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
                <p className="text-sm text-emerald-700 font-medium">Listas para Check-in</p>
                <p className="text-4xl font-bold text-emerald-900 mt-2">{reservasConfirmadas.length}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                <p className="text-sm text-blue-700 font-medium">En Hotel</p>
                <p className="text-4xl font-bold text-blue-900 mt-2">{reservasEnHotel.length}</p>
              </div>
            </div>
          )}

          {/* Reservas Confirmadas - Listas para Check-in */}
          {!loading && !error && reservasConfirmadas.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Listas para Check-in ({reservasConfirmadas.length})
              </h2>
              <div className="space-y-4">
                {reservasConfirmadas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reserva.estado)}`}>
                            {getEstadoTexto(reserva.estado)}
                          </span>
                          <span className="text-sm text-gray-400">{reserva.id}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {reserva.room?.tipo || 'Habitación'} #{reserva.room?.numero || '---'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reserva.user?.nombre || 'Usuario'} • {reserva.huespedes} huésped{reserva.huespedes > 1 ? 'es' : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(reserva.fechaEntrada).toLocaleDateString('es-AR')} - {new Date(reserva.fechaSalida).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => hacerCheckin(reserva.id)}
                        disabled={procesando === reserva.id}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {procesando === reserva.id ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <LogIn className="h-5 w-5" />
                            Hacer Check-in
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reservas en Hotel - Listas para Check-out */}
          {!loading && !error && reservasEnHotel.length > 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                En Hotel - Check-out ({reservasEnHotel.length})
              </h2>
              <div className="space-y-4">
                {reservasEnHotel.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="border border-gray-200 rounded-2xl p-6 hover:border-blue-300 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(reserva.estado)}`}>
                            {getEstadoTexto(reserva.estado)}
                          </span>
                          <span className="text-sm text-gray-400">{reserva.id}</span>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {reserva.room?.tipo || 'Habitación'} #{reserva.room?.numero || '---'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {reserva.user?.nombre || 'Usuario'} • {reserva.huespedes} huésped{reserva.huespedes > 1 ? 'es' : ''}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            Salida: {new Date(reserva.fechaSalida).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => hacerCheckout(reserva.id)}
                        disabled={procesando === reserva.id}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {procesando === reserva.id ? (
                          <>
                            <RefreshCw className="h-5 w-5 animate-spin" />
                            Procesando...
                          </>
                        ) : (
                          <>
                            <LogOut className="h-5 w-5" />
                            Hacer Check-out
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sin reservas para gestionar */}
          {!loading && !error && reservasConfirmadas.length === 0 && reservasEnHotel.length === 0 && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-12 text-center">
              <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay reservas para gestionar
              </h3>
              <p className="text-gray-500">
                Todas las reservas están en otros estados o no hay reservas activas
              </p>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
