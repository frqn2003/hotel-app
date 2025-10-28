// Componente para mostrar actividades recientes en el panel del operador

'use client'

import { useActividades } from '@/hooks'
import { Activity, ArrowRightCircle } from 'lucide-react'

export default function ActividadesRecientes() {
  const { actividades, loading, error } = useActividades({ limit: 10 })

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <p className="text-gray-600 text-center">Cargando actividades...</p>
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

  const getIconoActividad = (tipo: string) => {
    const iconos: Record<string, string> = {
      CHECKIN: '🔑',
      CHECKOUT: '🚪',
      RESERVA_CREADA: '📅',
      RESERVA_MODIFICADA: '✏️',
      RESERVA_CANCELADA: '❌',
      PAGO_PROCESADO: '💳',
      CAMBIO_ESTADO_HABITACION: '🔄',
      MANTENIMIENTO_INICIADO: '🔧',
      MANTENIMIENTO_COMPLETADO: '✅',
    }
    return iconos[tipo] || '📌'
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Actividad reciente
          </h2>
          <p className="text-sm text-gray-500">
            Últimas acciones registradas en el sistema
          </p>
        </div>
        <Activity className="h-8 w-8 text-gray-400" />
      </div>

      {actividades.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No hay actividades registradas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {actividades.map((actividad) => (
            <div
              key={actividad.id}
              className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIconoActividad(actividad.tipo)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {actividad.tipo.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(actividad.createdAt).toLocaleTimeString('es-AR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{actividad.descripcion}</p>
                  {actividad.user && (
                    <p className="text-xs text-gray-500 mt-2">
                      Usuario: {actividad.user.nombre}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          <a
            href="/panel-operador/actividades"
            className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900 py-3"
          >
            Ver todas las actividades
            <ArrowRightCircle className="inline h-4 w-4 ml-2" />
          </a>
        </div>
      )}
    </div>
  )
}
