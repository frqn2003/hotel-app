// Hook personalizado para gestionar habitaciones

import { useState, useEffect, useCallback } from 'react'
import { habitacionService } from '@/services'
import type { Habitacion } from '@/types'

export function useHabitaciones() {
  const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarHabitaciones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await habitacionService.obtenerHabitaciones()
      if (response.success && response.data) {
        setHabitaciones(response.data)
      } else {
        setError(response.error || 'Error al cargar habitaciones')
      }
    } catch (err) {
      setError('Error inesperado al cargar habitaciones')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    cargarHabitaciones()
  }, [cargarHabitaciones])

  const crearHabitacion = async (datos: Partial<Habitacion>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await habitacionService.crearHabitacion(datos)
      if (response.success) {
        await cargarHabitaciones()
        return response.data
      } else {
        setError(response.error || 'Error al crear habitación')
        return null
      }
    } catch (err) {
      setError('Error inesperado al crear habitación')
      return null
    } finally {
      setLoading(false)
    }
  }

  const actualizarHabitacion = async (id: string, datos: Partial<Habitacion>) => {
    setLoading(true)
    setError(null)
    try {
      const response = await habitacionService.actualizarHabitacion(id, datos)
      if (response.success) {
        await cargarHabitaciones()
        return response.data
      } else {
        setError(response.error || 'Error al actualizar habitación')
        return null
      }
    } catch (err) {
      setError('Error inesperado al actualizar habitación')
      return null
    } finally {
      setLoading(false)
    }
  }

  const eliminarHabitacion = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await habitacionService.eliminarHabitacion(id)
      if (response.success) {
        await cargarHabitaciones()
        return true
      } else {
        setError(response.error || 'Error al eliminar habitación')
        return false
      }
    } catch (err) {
      setError('Error inesperado al eliminar habitación')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    habitaciones,
    loading,
    error,
    cargarHabitaciones,
    crearHabitacion,
    actualizarHabitacion,
    eliminarHabitacion,
  }
}

// Hook para obtener una habitación específica
export function useHabitacionDetalle(id: string) {
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarHabitacion = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await habitacionService.obtenerHabitacion(id)
      if (response.success && response.data) {
        setHabitacion(response.data)
      } else {
        setError(response.error || 'Error al cargar habitación')
      }
    } catch (err) {
      setError('Error inesperado al cargar habitación')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    cargarHabitacion()
  }, [cargarHabitacion])

  return { habitacion, loading, error, cargarHabitacion }
}
