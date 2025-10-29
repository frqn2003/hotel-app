// Hook personalizado para gestión de reservas

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { reservaService } from '@/services/reserva.service'
import type { Reserva, CrearReservaDto, ActualizarReservaDto, FiltrosReserva } from '@/types'

export function useReservas(filtros?: FiltrosReserva) {
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar filtros para evitar bucle infinito
  const filtrosMemo = useMemo(() => filtros, [
    filtros?.userId, 
    filtros?.roomId, 
    filtros?.estado, 
    filtros?.fechaDesde, 
    filtros?.fechaHasta
  ])

  const cargarReservas = useCallback(async () => {
    // No cargar si no hay filtros definidos o si userId está vacío
    if (!filtrosMemo || (filtrosMemo.userId !== undefined && !filtrosMemo.userId)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await reservaService.obtenerReservas(filtrosMemo)
      
      if (response.success && response.data) {
        setReservas(response.data)
      } else {
        setError(response.message || 'Error al cargar reservas')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [filtrosMemo])

  useEffect(() => {
    cargarReservas()
  }, [cargarReservas])

  const crearReserva = async (data: CrearReservaDto) => {
    try {
      setError(null)
      const response = await reservaService.crearReserva(data)
      
      if (response.success && response.data) {
        setReservas(prev => [...prev, response.data!])
        return response.data
      } else {
        setError(response.message || 'Error al crear reserva')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }

  const actualizarReserva = async (id: string, data: ActualizarReservaDto) => {
    try {
      setError(null)
      const response = await reservaService.actualizarReserva(id, data)
      
      if (response.success && response.data) {
        setReservas(prev => 
          prev.map(r => r.id === id ? response.data! : r)
        )
        return response.data
      } else {
        setError(response.message || 'Error al actualizar reserva')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }

  const cancelarReserva = async (id: string) => {
    try {
      setError(null)
      const response = await reservaService.cancelarReserva(id)
      
      if (response.success && response.data) {
        setReservas(prev => 
          prev.map(r => r.id === id ? response.data! : r)
        )
        return response.data
      } else {
        setError(response.message || 'Error al cancelar reserva')
        return null
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return null
    }
  }

  const eliminarReserva = async (id: string) => {
    try {
      setError(null)
      const response = await reservaService.eliminarReserva(id)
      
      if (response.success) {
        setReservas(prev => prev.filter(r => r.id !== id))
        return true
      } else {
        setError(response.message || 'Error al eliminar reserva')
        return false
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      return false
    }
  }

  return {
    reservas,
    loading,
    error,
    cargarReservas,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    eliminarReserva
  }
}

// Hook específico para reservas del día
export function useReservasHoy() {
  const [checkinsHoy, setCheckinsHoy] = useState<Reserva[]>([])
  const [checkoutsHoy, setCheckoutsHoy] = useState<Reserva[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarReservasHoy = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [checkinsRes, checkoutsRes] = await Promise.all([
        reservaService.obtenerCheckinsHoy(),
        reservaService.obtenerCheckoutsHoy()
      ])
      
      if (checkinsRes.success && checkinsRes.data) {
        setCheckinsHoy(checkinsRes.data)
      }
      
      if (checkoutsRes.success && checkoutsRes.data) {
        setCheckoutsHoy(checkoutsRes.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarReservasHoy()
  }, [cargarReservasHoy])

  return {
    checkinsHoy,
    checkoutsHoy,
    loading,
    error,
    cargarReservasHoy
  }
}
