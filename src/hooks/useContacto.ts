// Hook personalizado para gestionar consultas de contacto

import { useState, useEffect, useCallback, useMemo } from 'react'
import { contactoService } from '@/services'
import type {
  Consulta,
  CrearConsultaDto,
  ResponderConsultaDto,
  FiltrosConsulta,
} from '@/types'

export function useContacto(filtros?: FiltrosConsulta) {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoizar filtros para evitar bucle infinito
  const filtrosMemo = useMemo(() => filtros, [
    filtros?.estado,
    filtros?.userId,
    filtros?.operadorId
  ])

  const cargarConsultas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await contactoService.obtenerConsultas(filtrosMemo)
      if (response.success && response.data) {
        setConsultas(response.data)
      } else {
        setError(response.error || 'Error al cargar consultas')
      }
    } catch (err) {
      setError('Error inesperado al cargar consultas')
    } finally {
      setLoading(false)
    }
  }, [filtrosMemo])

  useEffect(() => {
    cargarConsultas()
  }, [cargarConsultas])

  const crearConsulta = async (datos: CrearConsultaDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await contactoService.crearConsulta(datos)
      if (response.success) {
        await cargarConsultas() // Recargar lista
        return response.data
      } else {
        setError(response.error || 'Error al crear consulta')
        return null
      }
    } catch (err) {
      setError('Error inesperado al crear consulta')
      return null
    } finally {
      setLoading(false)
    }
  }

  const responderConsulta = async (id: string, datos: ResponderConsultaDto) => {
    setLoading(true)
    setError(null)
    try {
      const response = await contactoService.responderConsulta(id, datos)
      if (response.success) {
        await cargarConsultas() // Recargar lista
        return response.data
      } else {
        setError(response.error || 'Error al responder consulta')
        return null
      }
    } catch (err) {
      setError('Error inesperado al responder consulta')
      return null
    } finally {
      setLoading(false)
    }
  }

  const eliminarConsulta = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await contactoService.eliminarConsulta(id)
      if (response.success) {
        await cargarConsultas() // Recargar lista
        return true
      } else {
        setError(response.error || 'Error al eliminar consulta')
        return false
      }
    } catch (err) {
      setError('Error inesperado al eliminar consulta')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    consultas,
    loading,
    error,
    cargarConsultas,
    crearConsulta,
    responderConsulta,
    eliminarConsulta,
  }
}

// Hook para obtener una consulta específica
export function useConsultaDetalle(id: string) {
  const [consulta, setConsulta] = useState<Consulta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cargarConsulta = useCallback(async () => {
    if (!id) return
    
    setLoading(true)
    setError(null)
    try {
      const response = await contactoService.obtenerConsulta(id)
      if (response.success && response.data) {
        setConsulta(response.data)
      } else {
        setError(response.error || 'Error al cargar consulta')
      }
    } catch (err) {
      setError('Error inesperado al cargar consulta')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    cargarConsulta()
  }, [cargarConsulta])

  return { consulta, loading, error, cargarConsulta }
}
