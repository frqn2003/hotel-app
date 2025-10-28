// Componente para mostrar historial de actividades

'use client'

import { useActividades } from '@/hooks'
import type { TipoActividad, FiltrosActividad } from '@/types'

interface ListaActividadesProps {
  filtros?: FiltrosActividad
}

export default function ListaActividades({ filtros }: ListaActividadesProps) {
  const { actividades, loading, error } = useActividades(filtros)

  const getIconoActividad = (tipo: TipoActividad) => {
    switch (tipo) {
      case 'CHECKIN':
        return '🔑'
      case 'CHECKOUT':
        return '🚪'
      case 'RESERVA_CREADA':
        return '📅'
      case 'RESERVA_MODIFICADA':
        return '✏️'
      case 'RESERVA_CANCELADA':
        return '❌'
      case 'PAGO_PROCESADO':
        return '💳'
      case 'CAMBIO_ESTADO_HABITACION':
        return '🔄'
      case 'MANTENIMIENTO_INICIADO':
        return '🔧'
      case 'MANTENIMIENTO_COMPLETADO':
        return '✅'
      default:
        return '📌'
    }
  }

  const getColorActividad = (tipo: TipoActividad) => {
    switch (tipo) {
      case 'CHECKIN':
      case 'CHECKOUT':
        return 'bg-blue-50 border-blue-200'
      case 'RESERVA_CREADA':
      case 'RESERVA_MODIFICADA':
        return 'bg-green-50 border-green-200'
      case 'RESERVA_CANCELADA':
        return 'bg-red-50 border-red-200'
      case 'PAGO_PROCESADO':
        return 'bg-emerald-50 border-emerald-200'
      case 'CAMBIO_ESTADO_HABITACION':
        return 'bg-yellow-50 border-yellow-200'
      case 'MANTENIMIENTO_INICIADO':
      case 'MANTENIMIENTO_COMPLETADO':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (loading && actividades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando actividades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Historial de Actividades</h2>

      {actividades.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actividades.map((actividad) => (
            <div
              key={actividad.id}
              className={`border rounded-lg p-4 ${getColorActividad(actividad.tipo)}`}
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{getIconoActividad(actividad.tipo)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">
                      {actividad.tipo.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(actividad.createdAt).toLocaleString('es-AR')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm mb-3">{actividad.descripcion}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    {actividad.user && (
                      <div>
                        <span className="font-medium">Usuario:</span> {actividad.user.nombre}
                      </div>
                    )}
                    {actividad.operador && (
                      <div>
                        <span className="font-medium">Operador:</span> {actividad.operador.nombre}
                      </div>
                    )}
                    {actividad.room && (
                      <div>
                        <span className="font-medium">Habitación:</span> {actividad.room.numero}
                      </div>
                    )}
                    {actividad.reservation && (
                      <div>
                        <span className="font-medium">Reserva:</span>{' '}
                        {new Date(actividad.reservation.fechaEntrada).toLocaleDateString('es-AR')}
                      </div>
                    )}
                  </div>

                  {actividad.metadata && Object.keys(actividad.metadata).length > 0 && (
                    <details className="mt-3">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                        Ver detalles adicionales
                      </summary>
                      <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                        {JSON.stringify(actividad.metadata, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
