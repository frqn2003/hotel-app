// Componente para mostrar consultas pendientes en el panel del operador

'use client'

import { useContacto } from '@/hooks'
import { MessageCircle, User, Clock, ArrowRightCircle } from 'lucide-react'

export default function ConsultasPendientes() {
  const { consultas, loading, error } = useContacto({ estado: 'PENDIENTE' })

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">
        <p className="text-gray-600 text-center">Cargando consultas...</p>
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

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Consultas pendientes
          </h2>
          <p className="text-sm text-gray-500">
            {consultas.length} consulta{consultas.length !== 1 ? 's' : ''} esperando respuesta
          </p>
        </div>
        <MessageCircle className="h-8 w-8 text-gray-400" />
      </div>

      {consultas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No hay consultas pendientes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {consultas.slice(0, 5).map((consulta) => (
            <div
              key={consulta.id}
              className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{consulta.nombre}</p>
                    <p className="text-sm text-gray-500">{consulta.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(consulta.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">{consulta.asunto}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {consulta.mensaje}
              </p>
              
              <a
                href={`/panel-operador/consultas/${consulta.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Responder
                <ArrowRightCircle className="h-4 w-4" />
              </a>
            </div>
          ))}
          
          {consultas.length > 5 && (
            <a
              href="/panel-operador/consultas"
              className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900 py-3"
            >
              Ver todas las consultas ({consultas.length})
            </a>
          )}
        </div>
      )}
    </div>
  )
}
