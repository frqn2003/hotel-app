// Hook personalizado para gestionar actividades

import { useState, useEffect, useCallback, useMemo } from 'react'
import { actividadService } from '@/services'
import type {
  Actividad,
  CrearActividadDto,
  CheckinDto,
  CheckoutDto,
  FiltrosActividad,
} from '@/types'

export function useActividades(filtros?: FiltrosActividad) {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar filtros para evitar bucle infinito
  const filtrosMemo = useMemo(() => filtros, [
    filtros?.tipo,
    filtros?.userId,
    filtros?.reservationId,
    filtros?.roomId,
    filtros?.limit
  ])

  const cargarActividades = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await actividadService.obtenerActividades(filtrosMemo)
      if (response.success && response.data) {
        setActividades(response.data)
      } else {
        setError(response.error || 'Error al cargar actividades')
      }
    } catch (err) {
      setError('Error inesperado al cargar actividades')
    } finally {
      setLoading(false)
    }
  }, [filtrosMemo])

  useEffect(() => {
    cargarActividades()
  }, [cargarActividades])

  const crearActividad = async (datos: CrearActividadDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await actividadService.crearActividad(datos)
      if (response.success) {
        await cargarActividades()
        return response.data
      } else {
        setError(response.error || 'Error al crear actividad')
        return null
      }
    } catch (err) {
      setError('Error inesperado al crear actividad')
      return null
    } finally {
      setLoading(false)
    }
  }

  const registrarCheckin = async (datos: CheckinDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await actividadService.registrarCheckin(datos)
      if (response.success) {
        await cargarActividades()
        return response.data
      } else {
        setError(response.error || 'Error al registrar check-in')
        return null
      }
    } catch (err) {
      setError('Error inesperado al registrar check-in')
      return null
    } finally {
      setLoading(false)
    }
  }

  const registrarCheckout = async (datos: CheckoutDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await actividadService.registrarCheckout(datos)
      if (response.success) {
        await cargarActividades()
        return response.data
      } else {
        setError(response.error || 'Error al registrar check-out')
        return null
      }
    } catch (err) {
      setError('Error inesperado al registrar check-out')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    actividades,
    loading,
    error,
    cargarActividades,
    crearActividad,
    registrarCheckin,
    registrarCheckout,
  }
}
