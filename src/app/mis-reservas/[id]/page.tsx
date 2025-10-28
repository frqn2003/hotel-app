'use client'

import { use, useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { reservaService } from '@/services/reserva.service'
import type { Reserva } from '@/types'
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Building,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react'
import FormularioPago from '@/componentes/Pagos/FormularioPago'

export default function DetalleReserva({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [reserva, setReserva] = useState<Reserva | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarPago, setMostrarPago] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cancelando, setCancelando] = useState(false)

  const cargarReserva = async () => {
    try {
      setLoading(true)
      const response = await reservaService.obtenerReservaPorId(resolvedParams.id)
      
      if (response.success && response.data) {
        setReserva(response.data)
      } else {
        setError('No se encontró la reserva')
      }
    } catch (err) {
      setError('Error al cargar la reserva')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarReserva()
  }, [resolvedParams.id])

  const cancelarReserva = async () => {
    try {
      setCancelando(true)
      const response = await reservaService.cancelarReserva(resolvedParams.id)
      
      if (response) {
        await cargarReserva()
        setMostrarConfirmacion(false)
      }
    } catch (err) {
      setError('Error al cancelar la reserva')
    } finally {
      setCancelando(false)
    }
  }

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
      CHECKIN: 'Check-in Realizado',
      CHECKOUT: 'Finalizada',
      PENDIENTE: 'Pendiente de Pago',
      CANCELADA: 'Cancelada'
    }
    return textos[estado] || estado
  }

  if (loading) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] min-h-screen py-16">
          <div className="contenedor">
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando detalles...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !reserva) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] min-h-screen py-16">
          <div className="contenedor">
            <div className="bg-red-50 border border-red-200 rounded-3xl shadow-lg p-8">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">Error</p>
                  <p className="text-sm">{error || 'Reserva no encontrada'}</p>
                </div>
              </div>
              <a
                href="/mis-reservas"
                className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-black hover:gap-3 transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Mis Reservas
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const calcularNoches = () => {
    const inicio = new Date(reserva.fechaEntrada)
    const fin = new Date(reserva.fechaSalida)
    const diff = fin.getTime() - inicio.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Breadcrumb */}
          <a
            href="/panel-usuario"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-all hover:gap-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel
          </a>

          {/* Header con Estado */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                  Reserva {reserva.id}
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  {reserva.room?.tipo || 'Habitación'} - #{reserva.room?.numero || '---'}
                </h1>
                <p className="text-base text-gray-600 mt-2">
                  {calcularNoches()} noche{calcularNoches() > 1 ? 's' : ''} • {reserva.huespedes} huésped{reserva.huespedes > 1 ? 'es' : ''}
                </p>
              </div>
              <span className={`px-6 py-3 rounded-2xl text-base font-semibold border ${getEstadoColor(reserva.estado)}`}>
                {getEstadoTexto(reserva.estado)}
              </span>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Información Principal */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Fechas */}
              <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Fechas de Estadía
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                    <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-in</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {new Date(reserva.fechaEntrada).toLocaleDateString('es-AR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">A partir de las 14:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-2xl">
                    <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Check-out</p>
                      <p className="text-xl font-semibold text-gray-900">
                        {new Date(reserva.fechaSalida).toLocaleDateString('es-AR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-sm text-gray-600">Hasta las 11:00</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Detalles de la Habitación */}
              <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Detalles de la Habitación
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Building className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Tipo de Habitación</p>
                      <p className="font-semibold text-gray-900">{reserva.room?.tipo || 'No especificado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Número de Habitación</p>
                      <p className="font-semibold text-gray-900">#{reserva.room?.numero || 'A asignar'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Users className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500">Número de Huéspedes</p>
                      <p className="font-semibold text-gray-900">{reserva.huespedes} persona{reserva.huespedes > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notas Especiales */}
              {reserva.notasEspeciales && (
                <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Notas Especiales
                  </h2>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">
                    {reserva.notasEspeciales}
                  </p>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-8">
              {/* Resumen de Pago */}
              <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Resumen de Pago
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">Precio por noche</span>
                    <span className="font-semibold">${(reserva.precioTotal / calcularNoches()).toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                    <span className="text-gray-600">{calcularNoches()} noche{calcularNoches() > 1 ? 's' : ''}</span>
                    <span className="font-semibold">${reserva.precioTotal.toLocaleString('es-AR')}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${reserva.precioTotal.toLocaleString('es-AR')}</span>
                  </div>
                  
                  {/* Estado de Pago */}
                  {reserva.pagado ? (
                    <div className="flex items-center gap-2 p-4 bg-emerald-50 rounded-xl mt-4">
                      <CheckCircle className="h-5 w-5 text-emerald-700" />
                      <span className="text-sm font-medium text-emerald-700">
                        Pago Completado
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 p-4 bg-amber-50 rounded-xl mt-4">
                        <CreditCard className="h-5 w-5 text-amber-700" />
                        <span className="text-sm font-medium text-amber-700">
                          Pendiente de Pago
                        </span>
                      </div>
                      
                      {!mostrarPago ? (
                        <button
                          onClick={() => setMostrarPago(true)}
                          className="w-full mt-4 bg-black text-white py-3 px-4 rounded-xl font-semibold hover:bg-black/90 transition-all"
                        >
                          Pagar Ahora
                        </button>
                      ) : (
                        <button
                          onClick={() => setMostrarPago(false)}
                          className="w-full mt-4 bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                        >
                          Cancelar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </section>

              {/* Formulario de Pago */}
              {!reserva.pagado && mostrarPago && (
                <section>
                  <FormularioPago
                    reservationId={reserva.id}
                    monto={reserva.precioTotal}
                    onSuccess={async () => {
                      setMostrarPago(false)
                      // Recargar reserva para actualizar estado
                      await cargarReserva()
                    }}
                  />
                </section>
              )}

              {/* Cancelar Reserva */}
              {reserva.estado !== 'CANCELADA' && reserva.estado !== 'CHECKOUT' && (
                <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Cancelar Reserva
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Si necesitás cancelar tu reserva, podés hacerlo desde aquí. La habitación quedará disponible automáticamente.
                  </p>
                  <button
                    onClick={() => setMostrarConfirmacion(true)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-all"
                  >
                    <XCircle className="h-5 w-5" />
                    Cancelar Reserva
                  </button>
                </section>
              )}

              {/* Información de Contacto */}
              <section className="bg-black text-white rounded-3xl shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4">
                  ¿Necesitás Ayuda?
                </h3>
                <p className="text-white/80 text-sm mb-6">
                  Nuestro equipo está disponible para asistirte con cualquier consulta sobre tu reserva.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+541145550000"
                    className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Phone className="h-5 w-5" />
                    <span className="text-sm">+54 11 4555-0000</span>
                  </a>
                  <a
                    href="mailto:reservas@nextlujos.com"
                    className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">reservas@nextlujos.com</span>
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Modal de Confirmación */}
        {mostrarConfirmacion && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  ¿Cancelar Reserva?
                </h3>
                <p className="text-gray-600">
                  Esta acción no se puede deshacer. La habitación quedará disponible para otras reservas.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <button
                    onClick={() => setMostrarConfirmacion(false)}
                    disabled={cancelando}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
                  >
                    No, mantener
                  </button>
                  <button
                    onClick={cancelarReserva}
                    disabled={cancelando}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {cancelando ? 'Cancelando...' : 'Sí, cancelar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
