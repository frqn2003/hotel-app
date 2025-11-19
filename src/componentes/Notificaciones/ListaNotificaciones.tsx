// Componente para mostrar notificaciones del usuario

'use client'

import { useState, useEffect } from 'react'
import type { TipoNotificacion } from '@/types'

interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: TipoNotificacion
  leido: boolean
  createdAt: string
  enlace?: string
}

interface ListaNotificacionesProps {
  userId: string
}

export default function ListaNotificaciones({ userId }: ListaNotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const noLeidas = notificaciones.filter(n => !n.leido).length

  const marcarLeida = (id: string, leido: boolean) => {
    setNotificaciones(prev =>
      prev.map(n => (n.id === id ? { ...n, leido } : n))
    )
  }

  const marcarTodasLeidas = () => {
    setNotificaciones(prev => prev.map(n => ({ ...n, leido: true })))
  }

  const eliminarNotificacion = (id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id))
  }

  const getIconoTipo = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'INFO':
        return 'ℹ️'
      case 'ALERTA':
        return '⚠️'
      case 'RECORDATORIO':
        return '🔔'
      case 'CONFIRMACION':
        return '✅'
      default:
        return '📌'
    }
  }

  const getColorTipo = (tipo: TipoNotificacion) => {
    switch (tipo) {
      case 'INFO':
        return 'bg-blue-50 border-blue-200'
      case 'ALERTA':
        return 'bg-yellow-50 border-yellow-200'
      case 'RECORDATORIO':
        return 'bg-purple-50 border-purple-200'
      case 'CONFIRMACION':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (loading && notificaciones.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Cargando notificaciones...</p>
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
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
          {noLeidas > 0 && (
            <p className="text-sm text-gray-600">
              Tienes {noLeidas} notificación{noLeidas !== 1 ? 'es' : ''} sin leer
            </p>
          )}
        </div>
        {noLeidas > 0 && (
          <button
            onClick={marcarTodasLeidas}
            disabled={loading}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {/* Lista de notificaciones */}
      {notificaciones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((notif) => (
            <div
              key={notif.id}
              className={`border rounded-lg p-4 transition-all ${
                notif.leido ? 'bg-white border-gray-200 opacity-75' : getColorTipo(notif.tipo)
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getIconoTipo(notif.tipo)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800">{notif.titulo}</h3>
                    {!notif.leido && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{notif.mensaje}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {new Date(notif.createdAt).toLocaleString('es-AR')}
                    </p>
                    <div className="flex gap-2">
                      {!notif.leido && (
                        <button
                          onClick={() => marcarLeida(notif.id, true)}
                          disabled={loading}
                          className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
                        >
                          Marcar como leída
                        </button>
                      )}
                      <button
                        onClick={() => eliminarNotificacion(notif.id)}
                        disabled={loading}
                        className="text-xs text-red-600 hover:underline disabled:text-gray-400"
                      >
                        Eliminar
                      </button>
                      {notif.enlace && (
                        <a
                          href={notif.enlace}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Ver detalles →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
