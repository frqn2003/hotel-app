// Hook personalizado para gestionar notificaciones

import { useState, useEffect, useCallback, useMemo } from 'react'
import { notificacionService } from '@/services'
import type {
  Notificacion,
  CrearNotificacionDto,
  FiltrosNotificacion,
} from '@/types'

export function useNotificaciones(filtros?: FiltrosNotificacion) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])
  const [noLeidas, setNoLeidas] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar filtros para evitar bucle infinito
  const filtrosMemo = useMemo(() => filtros, [
    filtros?.userId,
    filtros?.leido
  ])

  const cargarNotificaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificacionService.obtenerNotificaciones(filtrosMemo as FiltrosNotificacion)
      if (response.success && response.data) {
        setNotificaciones(response.data)
        setNoLeidas(response.noLeidas || 0)
      } else {
        setError(response.error || 'Error al cargar notificaciones')
      }
    } catch (err) {
      setError('Error inesperado al cargar notificaciones')
    } finally {
      setLoading(false)
    }
  }, [filtros])

  useEffect(() => {
    cargarNotificaciones()
  }, [cargarNotificaciones])

  const crearNotificacion = async (datos: CrearNotificacionDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificacionService.crearNotificacion(datos)
      if (response.success) {
        await cargarNotificaciones()
        return response.data
      } else {
        setError(response.error || 'Error al crear notificación')
        return null
      }
    } catch (err) {
      setError('Error inesperado al crear notificación')
      return null
    } finally {
      setLoading(false)
    }
  }

  const marcarLeida = async (id: string, leido: boolean = true) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificacionService.actualizarNotificacion(id, { leido })
      if (response.success) {
        await cargarNotificaciones()
        return response.data
      } else {
        setError(response.error || 'Error al actualizar notificación')
        return null
      }
    } catch (err) {
      setError('Error inesperado al actualizar notificación')
      return null
    } finally {
      setLoading(false)
    }
  }

  const marcarTodasLeidas = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!filtrosMemo?.userId) {
        setError('userId requerido')
        return false
      }
      const response = await notificacionService.marcarTodasLeidas(filtrosMemo.userId)
      if (response.success) {
        await cargarNotificaciones()
        return true
      } else {
        setError(response.error || 'Error al marcar todas como leídas')
        return false
      }
    } catch (err) {
      setError('Error inesperado al marcar todas como leídas')
      return false
    } finally {
      setLoading(false)
    }
  }

  const eliminarNotificacion = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await notificacionService.eliminarNotificacion(id)
      if (response.success) {
        await cargarNotificaciones()
        return true
      } else {
        setError(response.error || 'Error al eliminar notificación')
        return false
      }
    } catch (err) {
      setError('Error inesperado al eliminar notificación')
      return false
    } finally {
      setLoading(false)
    }
  }

  const eliminarLeidas = async () => {
    setLoading(true)
    setError(null)
    try {
      if (!filtrosMemo?.userId) {
        setError('userId requerido')
        return false
      }
      const response = await notificacionService.eliminarNotificacionesLeidas(
        filtrosMemo.userId
      )
      if (response.success) {
        await cargarNotificaciones()
        return true
      } else {
        setError(response.error || 'Error al eliminar notificaciones leídas')
        return false
      }
    } catch (err) {
      setError('Error inesperado al eliminar notificaciones leídas')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    notificaciones,
    noLeidas,
    loading,
    error,
    cargarNotificaciones,
    crearNotificacion,
    marcarLeida,
    marcarTodasLeidas,
    eliminarNotificacion,
    eliminarLeidas,
  }
}
