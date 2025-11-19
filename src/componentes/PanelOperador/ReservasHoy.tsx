// Componente para mostrar las reservas de hoy en el panel del operador

'use client'

import { useEffect, useState } from 'react'
import { Phone, Clock, Key, UserCheck, ArrowRightCircle } from 'lucide-react'

type Reserva = {
  id: string
  estado: string
  fechaEntrada: string
  fechaSalida: string
  room?: { tipo: string; numero: number }
  user?: { nombre: string; telefono?: string }
}

export default function ReservasHoy() {
  const [checkinsHoy, setCheckinsHoy] = useState<Reserva[]>([])
  const [checkoutsHoy, setCheckoutsHoy] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarReservas = async () => {
      try {
        setLoading(true)
        // Backend deshabilitado - Datos mock
        await new Promise(resolve => setTimeout(resolve, 300))
        
        const hoy = new Date()
        
        setCheckinsHoy([
          {
            id: 'R-001',
            estado: 'CONFIRMADA',
            fechaEntrada: hoy.toISOString(),
            fechaSalida: new Date(Date.now() + 86400000 * 3).toISOString(),
            room: { tipo: 'DOBLE', numero: 102 },
            user: { nombre: 'María González', telefono: '+598 99 123 456' }
          }
        ])
        
        setCheckoutsHoy([
          {
            id: 'R-002',
            estado: 'CHECKIN',
            fechaEntrada: new Date(Date.now() - 86400000 * 2).toISOString(),
            fechaSalida: hoy.toISOString(),
            room: { tipo: 'SUITE', numero: 201 },
            user: { nombre: 'Carlos Pérez', telefono: '+598 99 654 321' }
          }
        ])
        
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    
    cargarReservas()
  }, [])

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
        <p className="text-gray-600 text-center">Cargando reservas...</p>
      </div>
    )
  }

  const todasReservas = [...checkinsHoy, ...checkoutsHoy]
    .sort((a, b) => new Date(a.fechaEntrada).getTime() - new Date(b.fechaEntrada).getTime())

  const getEstadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      CONFIRMADA: 'bg-amber-50 text-amber-700',
      CHECKIN: 'bg-emerald-50 text-emerald-700',
      CHECKOUT: 'bg-blue-50 text-blue-700',
      PENDIENTE: 'bg-amber-50 text-amber-700'
    }
    return colores[estado] || 'bg-gray-50 text-gray-700'
  }

  const getEstadoTexto = (estado: string, esCheckout: boolean) => {
    if (esCheckout) return 'Check-out Pendiente'
    if (estado === 'CONFIRMADA') return 'Check-in Pendiente'
    if (estado === 'CHECKIN') return 'Activa'
    return estado
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reservas de hoy</h2>
          <p className="text-sm text-gray-500">
            {checkinsHoy.length} check-in{checkinsHoy.length !== 1 ? 's' : ''} • {checkoutsHoy.length} check-out{checkoutsHoy.length !== 1 ? 's' : ''}
          </p>
        </div>
        <a
          href="/panel-operador/reservas"
          className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
        >
          Ver calendario completo
          <ArrowRightCircle className="h-4 w-4" />
        </a>
      </div>

      {todasReservas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No hay reservas programadas para hoy</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {todasReservas.map((reserva) => {
            const esCheckout = checkoutsHoy.some(c => c.id === reserva.id)
            
            return (
              <div 
                key={reserva.id} 
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-5"
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm uppercase tracking-widest text-gray-400">
                      {reserva.id}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(reserva.estado)}`}>
                      {getEstadoTexto(reserva.estado, esCheckout)}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">
                    {reserva.room?.tipo || 'Habitación'} ({reserva.room?.numero || '---'})
                  </p>
                  <p className="text-sm text-gray-600">
                    {reserva.user?.nombre || 'Huésped'}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
                    {reserva.user?.telefono && (
                      <span className="inline-flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {reserva.user.telefono}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Check-in: {new Date(reserva.fechaEntrada).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Check-out: {new Date(reserva.fechaSalida).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/panel-operador/gestionar-reservas"
                    className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/90 transition-colors"
                  >
                    {reserva.estado === 'CONFIRMADA' && !esCheckout && (
                      <>
                        <UserCheck className="h-4 w-4" />
                        Check-in
                      </>
                    )}
                    {(reserva.estado === 'CHECKIN' || esCheckout) && (
                      <>
                        <Key className="h-4 w-4" />
                        Check-out
                      </>
                    )}
                  </a>
                  <a
                    href={`/panel-operador/reservas/${reserva.id}`}
                    className="text-sm font-medium text-black inline-flex items-center gap-2 hover:gap-3 transition-all"
                  >
                    Detalles
                    <ArrowRightCircle className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
