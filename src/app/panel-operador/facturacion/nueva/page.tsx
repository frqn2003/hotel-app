'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from 'lucide-react'

type Pago = {
  id: string
  monto: number
  metodoPago: string
  fechaPago: string
  reservation: {
    id: string
    fechaEntrada: string
    fechaSalida: string
    precioTotal: number
    user: {
      nombre: string
      email: string
    }
    room: {
      numero: number
      tipo: string
    }
  }
}

type DetalleItem = {
  descripcion: string
  cantidad: number
  precio: number
}

export default function NuevaFactura() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [pagoSeleccionado, setPagoSeleccionado] = useState<string>('')
  const [detalles, setDetalles] = useState<DetalleItem[]>([
    { descripcion: 'Alojamiento', cantidad: 1, precio: 0 }
  ])
  const [tasaImpuesto, setTasaImpuesto] = useState(21) // 21% IVA por defecto
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    cargarPagosSinFactura()
  }, [])

  const cargarPagosSinFactura = async () => {
    try {
      // Backend deshabilitado - Datos mock
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const pagosMock: Pago[] = [
        {
          id: 'PAG-001',
          monto: 240000,
          metodoPago: 'TARJETA_CREDITO',
          fechaPago: new Date().toISOString(),
          reservation: {
            id: 'RSV-001',
            fechaEntrada: new Date(Date.now() + 86400000 * 2).toISOString(),
            fechaSalida: new Date(Date.now() + 86400000 * 5).toISOString(),
            precioTotal: 240000,
            user: {
              nombre: 'María González',
              email: 'maria@example.com'
            },
            room: {
              numero: 102,
              tipo: 'DOBLE'
            }
          }
        },
        {
          id: 'PAG-002',
          monto: 150000,
          metodoPago: 'EFECTIVO',
          fechaPago: new Date().toISOString(),
          reservation: {
            id: 'RSV-002',
            fechaEntrada: new Date(Date.now() - 86400000).toISOString(),
            fechaSalida: new Date(Date.now() + 86400000 * 2).toISOString(),
            precioTotal: 150000,
            user: {
              nombre: 'Carlos Pérez',
              email: 'carlos@example.com'
            },
            room: {
              numero: 201,
              tipo: 'SIMPLE'
            }
          }
        }
      ]
      
      setPagos(pagosMock)
    } catch (err) {
      console.error('Error al cargar pagos:', err)
    }
  }

  const pagoActual = pagos.find(p => p.id === pagoSeleccionado)

  useEffect(() => {
    if (pagoActual) {
      // Actualizar precio del alojamiento automáticamente
      setDetalles(prev => 
        prev.map((det, idx) => 
          idx === 0 ? { ...det, precio: pagoActual.reservation.precioTotal } : det
        )
      )
    }
  }, [pagoSeleccionado, pagoActual])

  const agregarDetalle = () => {
    setDetalles([...detalles, { descripcion: '', cantidad: 1, precio: 0 }])
  }

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      setDetalles(detalles.filter((_, i) => i !== index))
    }
  }

  const actualizarDetalle = (index: number, campo: keyof DetalleItem, valor: any) => {
    const nuevosDetalles = [...detalles]
    nuevosDetalles[index] = { ...nuevosDetalles[index], [campo]: valor }
    setDetalles(nuevosDetalles)
  }

  const calcularSubtotal = () => {
    return detalles.reduce((sum, det) => sum + (det.cantidad * det.precio), 0)
  }

  const calcularImpuestos = () => {
    return calcularSubtotal() * (tasaImpuesto / 100)
  }

  const calcularTotal = () => {
    return calcularSubtotal() + calcularImpuestos()
  }

  const generarFactura = async () => {
    if (!pagoSeleccionado) {
      setError('Debe seleccionar un pago')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Backend deshabilitado - Simular generación de factura
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const numeroFactura = `FAC-${Date.now().toString().slice(-6)}`
      alert(`Factura generada exitosamente: ${numeroFactura}\n\nSubtotal: $${calcularSubtotal().toLocaleString()}\nImpuestos: $${calcularImpuestos().toLocaleString()}\nTotal: $${calcularTotal().toLocaleString()}`)
      
      setTimeout(() => {
        window.location.href = '/panel-operador/facturacion'
      }, 500)
    } catch (err) {
      setError('Error al generar factura')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor max-w-5xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <a
              href="/panel-operador/facturacion"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a facturas
            </a>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Generar Nueva Factura
            </h1>
            <p className="text-base text-gray-600 mt-2">
              Crea una factura para un pago existente
            </p>
          </section>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Selección de Pago */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Seleccionar Pago</h2>
            
            {pagos.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay pagos pendientes de facturación
              </p>
            ) : (
              <select
                value={pagoSeleccionado}
                onChange={(e) => setPagoSeleccionado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="">Seleccione un pago...</option>
                {pagos.map((pago) => (
                  <option key={pago.id} value={pago.id}>
                    {pago.reservation.user.nombre} - Habitación {pago.reservation.room.numero} - ${pago.monto.toLocaleString('es-AR')}
                  </option>
                ))}
              </select>
            )}

            {pagoActual && (
              <div className="mt-6 p-6 bg-gray-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-3">Detalles del Pago</h3>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-medium">{pagoActual.reservation.user.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Habitación:</span>
                    <span className="font-medium">{pagoActual.reservation.room.tipo} #{pagoActual.reservation.room.numero}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monto Pagado:</span>
                    <span className="font-medium">${pagoActual.monto.toLocaleString('es-AR')}</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Detalles de la Factura */}
          {pagoSeleccionado && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Detalles de Facturación</h2>
                <button
                  onClick={agregarDetalle}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Ítem
                </button>
              </div>

              <div className="space-y-4">
                {detalles.map((detalle, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción
                      </label>
                      <input
                        type="text"
                        value={detalle.descripcion}
                        onChange={(e) => actualizarDetalle(index, 'descripcion', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Ej: Servicio a la habitación"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) => actualizarDetalle(index, 'cantidad', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Unitario
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={detalle.precio}
                        onChange={(e) => actualizarDetalle(index, 'precio', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        disabled={index === 0} // Primer item (alojamiento) es automático
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${(detalle.cantidad * detalle.precio).toLocaleString('es-AR')}
                      </span>
                      {index > 0 && (
                        <button
                          onClick={() => eliminarDetalle(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="max-w-md ml-auto space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">${calcularSubtotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-700">
                    <div className="flex items-center gap-2">
                      <span>IVA:</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={tasaImpuesto}
                        onChange={(e) => setTasaImpuesto(parseFloat(e.target.value))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span>%</span>
                    </div>
                    <span className="font-medium">${calcularImpuestos().toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${calcularTotal().toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={generarFactura}
                disabled={loading || !pagoSeleccionado}
                className="w-full mt-8 bg-black text-white py-4 px-6 rounded-xl font-semibold hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Generando Factura...' : 'Generar Factura'}
              </button>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
