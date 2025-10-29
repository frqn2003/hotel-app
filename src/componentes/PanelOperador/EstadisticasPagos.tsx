// Componente para mostrar estadísticas de pagos

'use client'

import { usePagos } from '@/hooks'
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default function EstadisticasPagos() {
  const { pagos, loading, error } = usePagos()

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <p className="text-gray-600 text-center">Cargando estadísticas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <p className="text-red-600 text-center">Error: {error}</p>
      </div>
    )
  }

  // Calcular estadísticas
  const pagosCompletados = pagos.filter(p => p.estado === 'COMPLETADO')
  const pagosPendientes = pagos.filter(p => p.estado === 'PENDIENTE')
  const pagosFallidos = pagos.filter(p => p.estado === 'FALLIDO')
  
  const totalCompletado = pagosCompletados.reduce((sum, p) => sum + p.monto, 0)
  const totalPendiente = pagosPendientes.reduce((sum, p) => sum + p.monto, 0)

  const estadisticas = [
    {
      label: 'Pagos completados',
      valor: pagosCompletados.length,
      monto: `$${totalCompletado.toLocaleString('es-AR')}`,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Pagos pendientes',
      valor: pagosPendientes.length,
      monto: `$${totalPendiente.toLocaleString('es-AR')}`,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      label: 'Pagos fallidos',
      valor: pagosFallidos.length,
      monto: 'Requieren atención',
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50'
    }
  ]

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Estadísticas de pagos
          </h2>
          <p className="text-sm text-gray-500">
            Resumen de transacciones
          </p>
        </div>
        <DollarSign className="h-8 w-8 text-gray-400" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {estadisticas.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`h-6 w-6 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>
                  {stat.valor}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {stat.label}
              </p>
              <p className="text-xs text-gray-600">{stat.monto}</p>
            </div>
          )
        })}
      </div>

      {pagos.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 text-blue-700">
            <TrendingUp className="h-5 w-5" />
            <p className="text-sm font-medium">
              Total procesado: ${totalCompletado.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
