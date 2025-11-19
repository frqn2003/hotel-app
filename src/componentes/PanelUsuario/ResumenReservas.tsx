// Componente para el resumen de reservas en el panel de usuario

'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, Star, CreditCard } from 'lucide-react'

interface ResumenReservasProps {
  userId: string
}

type Reserva = {
  id: string
  estado: string
  precioTotal: number
  updatedAt: string
  room?: {
    tipo: string
  }
}

export default function ResumenReservas({ userId }: ResumenReservasProps) {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarReservas = async () => {
      setLoading(true)
      // Backend deshabilitado - Datos mock
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const reservasMock: Reserva[] = [
        {
          id: 'RSV-001',
          estado: 'CONFIRMADA',
          precioTotal: 240000,
          updatedAt: new Date().toISOString(),
          room: { tipo: 'DOBLE' }
        },
        {
          id: 'RSV-002',
          estado: 'CHECKOUT',
          precioTotal: 150000,
          updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
          room: { tipo: 'SIMPLE' }
        }
      ]
      
      setReservas(reservasMock)
      setLoading(false)
    }
    
    if (userId) {
      cargarReservas()
    }
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-32"></div>
        ))}
      </div>
    )
  }

  const reservasActivas = reservas.filter(r => 
    r.estado === 'CONFIRMADA' || r.estado === 'CHECKIN'
  ).length

  const ultimoPago = reservas
    .filter(r => r.estado === 'CHECKOUT')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]

  const resumen = [
    {
      etiqueta: "Reservas activas",
      valor: reservasActivas.toString(),
      descripcion: "Tus próximas estancias",
      icon: CalendarDays
    },
    {
      etiqueta: "Puntos disponibles",
      valor: (reservasActivas * 310).toString(),
      descripcion: "Programa Recompensas Next Lujos",
      icon: Star
    },
    {
      etiqueta: "Último pago",
      valor: ultimoPago ? `$ ${ultimoPago.precioTotal.toLocaleString('es-AR')}` : '$ 0',
      descripcion: ultimoPago 
        ? `${ultimoPago.room?.tipo} • ${new Date(ultimoPago.updatedAt).toLocaleDateString('es-AR')}`
        : 'Sin pagos registrados',
      icon: CreditCard
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {resumen.map((dato) => {
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
  )
}
