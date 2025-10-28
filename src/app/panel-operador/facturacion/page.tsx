'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { Search, Download, Eye, FileText, Plus, Calendar, User, RefreshCw, AlertCircle } from 'lucide-react'

type Factura = {
  id: string
  numeroFactura: string
  subtotal: number
  impuestos: number
  total: number
  emitidaEl: string
  payment: {
    monto: number
    metodoPago: string
    reservation: {
      id: string
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
  detalles: any[]
}

export default function GestionFacturas() {
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarFacturas()
  }, [])

  const cargarFacturas = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/facturas')
      const data = await response.json()

      if (data.success) {
        setFacturas(data.data)
      } else {
        setError('Error al cargar facturas')
      }
    } catch (err) {
      setError('Error al cargar facturas')
    } finally {
      setLoading(false)
    }
  }

  const facturasFiltradas = facturas.filter(factura =>
    factura.numeroFactura.toLowerCase().includes(busqueda.toLowerCase()) ||
    factura.payment.reservation.user.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const estadisticas = {
    total: facturas.reduce((sum, f) => sum + f.total, 0),
    cantidad: facturas.length
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Gestión de Facturas
                </h1>
                <p className="text-base text-gray-600 mt-2">
                  Administra y genera facturas de pagos
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={cargarFacturas}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
                <a
                  href="/panel-operador/facturacion/nueva"
                  className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl font-medium hover:bg-black/90 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Factura
                </a>
              </div>
            </div>
          </section>

          {/* Estadísticas */}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Facturado</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${estadisticas.total.toLocaleString('es-AR')}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Facturas Generadas</p>
                    <p className="text-3xl font-bold text-gray-900">{estadisticas.cantidad}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Búsqueda */}
          {!loading && !error && (
            <div className="bg-white border border-gray-100 rounded-3xl p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por número de factura o cliente..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-4 text-gray-600">Cargando facturas...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
              <div className="flex items-center gap-3 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Lista de Facturas */}
          {!loading && !error && (
            <section className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
              {facturasFiltradas.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No hay facturas
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {busqueda ? 'No se encontraron facturas con ese criterio' : 'Aún no se han generado facturas'}
                  </p>
                  {!busqueda && (
                    <a
                      href="/panel-operador/facturacion/nueva"
                      className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all"
                    >
                      <Plus className="h-4 w-4" />
                      Generar Primera Factura
                    </a>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Número
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Habitación
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Método Pago
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {facturasFiltradas.map((factura) => (
                        <tr key={factura.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {factura.numeroFactura}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {factura.payment.reservation.user.nombre}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {factura.payment.reservation.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">
                              {factura.payment.reservation.room.tipo} #{factura.payment.reservation.room.numero}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="h-4 w-4" />
                              {new Date(factura.emitidaEl).toLocaleDateString('es-AR')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                ${factura.total.toLocaleString('es-AR')}
                              </p>
                              <p className="text-xs text-gray-500">
                                IVA: ${factura.impuestos.toLocaleString('es-AR')}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              {factura.payment.metodoPago.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => alert('Vista de factura: Implementar PDF')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="Ver factura"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => alert('Descarga de factura: Implementar PDF')}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="Descargar PDF"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
