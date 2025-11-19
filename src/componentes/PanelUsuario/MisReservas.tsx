// Componente para mostrar las reservas del usuario

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Clock, ArrowRightCircle, MapPin } from 'lucide-react'

interface MisReservasProps {
  userId: string
}

type Reserva = {
  id: string
  fechaEntrada: string
  fechaSalida: string
  estado: string
  huespedes: number
  precioTotal: number
  room?: {
    tipo: string
    numero: number
  }
}

export default function MisReservas({ userId }: MisReservasProps) {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargarReservas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Backend deshabilitado - Usando datos mock
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const reservasMock: Reserva[] = [
        {
          id: 'RSV-001',
          fechaEntrada: new Date(Date.now() + 86400000 * 2).toISOString(),
          fechaSalida: new Date(Date.now() + 86400000 * 5).toISOString(),
          estado: 'CONFIRMADA',
          huespedes: 2,
          precioTotal: 240000,
          room: {
            tipo: 'DOBLE',
            numero: 102
          }
        },
        {
          id: 'RSV-002',
          fechaEntrada: new Date(Date.now() - 86400000 * 10).toISOString(),
          fechaSalida: new Date(Date.now() - 86400000 * 7).toISOString(),
          estado: 'CHECKOUT',
          huespedes: 1,
          precioTotal: 150000,
          room: {
            tipo: 'SIMPLE',
            numero: 101
          }
        }
      ]
      
      setReservas(reservasMock)
    } catch (err) {
      setError('Error al cargar las reservas')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      cargarReservas()
    }
  }, [userId])

  // Recargar reservas cuando el usuario vuelve a la pestaña
  useEffect(() => {
    if (!userId) return

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        cargarReservas()
      }
    }

    const handleFocus = () => {
      cargarReservas()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [userId])

  if (!userId) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
        <p className="text-gray-600 text-center">Cargando sesión...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-black border-t-transparent animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-900">Cargando tus reservas</p>
            <p className="text-sm text-gray-500 mt-1">Esto solo tomará un momento...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
        <p className="text-red-600 text-center">Error: {error}</p>
      </div>
    )
  }

  const reservasActivas = reservas.filter(r => 
    ['CONFIRMADA', 'CHECKIN', 'PENDIENTE'].includes(r.estado)
  )

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      CONFIRMADA: 'bg-emerald-50 text-emerald-700',
      CHECKIN: 'bg-blue-50 text-blue-700',
      CHECKOUT: 'bg-gray-50 text-gray-700',
      PENDIENTE: 'bg-amber-50 text-amber-700',
      CANCELADA: 'bg-red-50 text-red-700'
    }
    return colores[estado] || 'bg-gray-50 text-gray-700'
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

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reservas recientes</h2>
          <p className="text-sm text-gray-500">
            {reservasActivas.length} reserva{reservasActivas.length !== 1 ? 's' : ''} activa{reservasActivas.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/mis-reservas"
          className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          Ver historial completo
          <ArrowRightCircle className="h-4 w-4" />
        </Link>
      </div>

      {reservas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No tienes reservas</p>
          <Link
            href="/habitaciones"
            className="inline-flex items-center gap-2 mt-4 bg-black text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
          >
            Explorar habitaciones
            <ArrowRightCircle className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {reservas.slice(0, 5).map((reserva) => (
            <div 
              key={reserva.id} 
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm uppercase tracking-widest text-gray-400">
                  {reserva.id}
                </span>
                <p className="text-lg font-semibold text-gray-900">
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
              <div className="flex items-center md:flex-col gap-4 md:gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                  {getEstadoTexto(reserva.estado)}
                </span>
                <a
                  href={`/mis-reservas/${reserva.id}`}
                  className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Detalles
                  <ArrowRightCircle className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
