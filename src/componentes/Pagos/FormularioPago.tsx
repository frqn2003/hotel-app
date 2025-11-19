// Componente de formulario de pago usando el hook

'use client'

import { useState } from 'react'
// import { usePagos } from '@/hooks' // Hook eliminado - frontend only
import type { MetodoPago } from '@/types'

interface FormularioPagoProps {
  monto: number
  onSuccess?: () => void
}

export default function FormularioPago({
  monto,
  onSuccess,
}: FormularioPagoProps) {
  // Backend deshabilitado - Estado local
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [metodoPago, setMetodoPago] = useState<MetodoPago>('TARJETA_CREDITO')
  const [success, setSuccess] = useState(false)

  const metodosPago: { value: MetodoPago; label: string }[] = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA_CREDITO', label: 'Tarjeta de Crédito' },
    { value: 'TARJETA_DEBITO', label: 'Tarjeta de Débito' },
    { value: 'TRANSFERENCIA', label: 'Transferencia Bancaria' },
    { value: 'STRIPE', label: 'Pago con Stripe' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(false)
    setLoading(true)
    setError(null)

    // Backend deshabilitado - Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSuccess(true)
    setLoading(false)
    
    if (onSuccess) {
      setTimeout(() => onSuccess(), 2000)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Procesar Pago</h2>

      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Monto a pagar:</p>
        <p className="text-3xl font-bold text-blue-600">
          ${monto.toLocaleString('es-AR')}
        </p>
      </div>

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          ¡Pago procesado exitosamente!
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700 mb-2">
            Método de pago
          </label>
          <select
            id="metodoPago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {metodosPago.map((metodo) => (
              <option key={metodo.value} value={metodo.value}>
                {metodo.label}
              </option>
            ))}
          </select>
        </div>

        {metodoPago === 'TARJETA_CREDITO' && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600 mb-3">Información de la tarjeta</p>
            <input
              type="text"
              placeholder="Número de tarjeta"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="MM/AA"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="CVV"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {metodoPago === 'TRANSFERENCIA' && (
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>CBU:</strong> 0000003100010000000001
            </p>
            <p className="text-sm text-gray-700">
              <strong>Alias:</strong> HOTEL.PAGO.001
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Procesando...' : success ? '¡Pago Completado!' : 'Confirmar Pago'}
        </button>
      </form>
    </div>
  )
}
