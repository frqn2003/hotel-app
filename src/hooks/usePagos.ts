// Hook personalizado para gestionar pagos

import { useState, useEffect, useCallback, useMemo } from 'react'
import { pagoService } from '@/services'
import type { Pago, CrearPagoDto, ActualizarPagoDto, FiltrosPago } from '@/types'

export function usePagos(filtros?: FiltrosPago) {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar filtros para evitar bucle infinito
  const filtrosMemo = useMemo(() => filtros, [
    filtros?.reservationId,
    filtros?.estado
  ])

  const cargarPagos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await pagoService.obtenerPagos(filtrosMemo)
      if (response.success && response.data) {
        setPagos(response.data)
      } else {
        setError(response.error || 'Error al cargar pagos')
      }
    } catch (err) {
      setError('Error inesperado al cargar pagos')
    } finally {
      setLoading(false)
    }
  }, [filtrosMemo])

  useEffect(() => {
    cargarPagos()
  }, [cargarPagos])

  const crearPago = async (datos: CrearPagoDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await pagoService.crearPago(datos)
      if (response.success) {
        await cargarPagos()
        return response.data
      } else {
        setError(response.error || 'Error al crear pago')
        return null
      }
    } catch (err) {
      setError('Error inesperado al crear pago')
      return null
    } finally {
      setLoading(false)
    }
  }

  const actualizarPago = async (id: string, datos: ActualizarPagoDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await pagoService.actualizarPago(id, datos)
      if (response.success) {
        await cargarPagos()
        return response.data
      } else {
        setError(response.error || 'Error al actualizar pago')
        return null
      }
    } catch (err) {
      setError('Error inesperado al actualizar pago')
      return null
    } finally {
      setLoading(false)
    }
  }

  const eliminarPago = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await pagoService.eliminarPago(id)
      if (response.success) {
        await cargarPagos()
        return true
      } else {
        setError(response.error || 'Error al eliminar pago')
        return false
      }
    } catch (err) {
      setError('Error inesperado al eliminar pago')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    pagos,
    loading,
    error,
    cargarPagos,
    crearPago,
    actualizarPago,
    eliminarPago,
  }
}

// Hook para obtener un pago específico
export function usePagoDetalle(id: string) {
  const [pago, setPago] = useState<Pago | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarPago = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await pagoService.obtenerPago(id)
      if (response.success && response.data) {
        setPago(response.data)
      } else {
        setError(response.error || 'Error al cargar pago')
      }
    } catch (err) {
      setError('Error inesperado al cargar pago')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    cargarPago()
  }, [cargarPago])

  return { pago, loading, error, cargarPago }
}
