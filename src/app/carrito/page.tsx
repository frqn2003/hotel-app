'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Trash2,
  Calendar,
  Users,
  CreditCard,
  Shield,
  CheckCircle,
  Edit
} from "lucide-react"

type ReservaCarrito = {
  habitacion: any
  fechaEntrada: string
  fechaSalida: string
  noches: number
  adultos: number
  niños: number
  serviciosExtra: string[]
  requerimientosEspeciales: string
  precioTotal: number
}

export default function CarritoPage() {
  const router = useRouter()
  const [reserva, setReserva] = useState<ReservaCarrito | null>(null)

  useEffect(() => {
    const reservaGuardada = localStorage.getItem('reservaPendiente')
    if (reservaGuardada) {
      setReserva(JSON.parse(reservaGuardada))
    }
  }, [])

  const eliminarReserva = () => {
    localStorage.removeItem('reservaPendiente')
    router.push('/habitaciones')
  }

  const procederPago = () => {
    localStorage.setItem('reservaCheckout', JSON.stringify(reserva))
    router.push('/checkout')
  }

  const editarReserva = () => {
    router.back()
  }

  if (!reserva) {
    return (
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">Carrito Vacío</h1>
          <p className="text-gray-600 mb-8">No tienes reservas pendientes</p>
          <button
            onClick={() => router.push('/habitaciones')}
            className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-black/90 transition-colors"
          >
            Ver Habitaciones Disponibles
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#F3F6FA] py-16 min-h-screen">
      <div className="contenedor">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900">Carrito de Reserva</h1>
            <p className="text-gray-600">Revisa y confirma los detalles de tu reserva</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles de la reserva */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Tu Reserva</h2>
                <div className="flex gap-3">
                  <button
                    onClick={editarReserva}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    onClick={eliminarReserva}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>

              {/* Información de la habitación */}
              <div className="flex items-start gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="w-20 h-20 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{reserva.habitacion.tipo}</h3>
                  <p className="text-gray-600 mb-2">Habitación {reserva.habitacion.numero}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {reserva.noches} noche(s)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {reserva.adultos} adulto(s), {reserva.niños} niño(s)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${reserva.precioTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Detalles de fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Check-in</h4>
                  <p className="text-gray-600">{new Date(reserva.fechaEntrada).toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="text-sm text-gray-500">Desde las 14:00</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Check-out</h4>
                  <p className="text-gray-600">{new Date(reserva.fechaSalida).toLocaleDateString('es-AR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                  <p className="text-sm text-gray-500">Hasta las 12:00</p>
                </div>
              </div>

              {/* Servicios extra */}
              {reserva.serviciosExtra.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Servicios Incluidos</h4>
                  <div className="flex flex-wrap gap-2">
                    {reserva.serviciosExtra.map((servicio, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {servicio}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Requerimientos especiales */}
              {reserva.requerimientosEspeciales && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tus Requerimientos</h4>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                    {reserva.requerimientosEspeciales}
                  </p>
                </div>
              )}
            </div>

            {/* Información de pago seguro */}
            <div className="bg-blue-50 rounded-3xl p-6 mt-6">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Pago 100% Seguro</h4>
                  <p className="text-sm text-blue-700">
                    Tus datos están protegidos con encriptación SSL. No almacenamos información de tu tarjeta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Resumen de pago */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-lg p-8 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen de Pago</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${reserva.precioTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Impuestos</span>
                  <span>${Math.round(reserva.precioTotal * 0.21).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasa turística</span>
                  <span>${Math.round(reserva.precioTotal * 0.015).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${(reserva.precioTotal * 1.225).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={procederPago}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-black/90 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="h-5 w-5" />
                Proceder al Pago
              </button>

              <div className="mt-4 space-y-3 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Precio final incluye todos los impuestos
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Sin cargos sorpresa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}