'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Download,
  BarChart3,
  Users,
  Building,
  CreditCard,
  Loader,
  AlertCircle,
  RefreshCw
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type ConsultaDisponible = {
  id: string
  nombre: string
  descripcion: string
  parametros: string[]
}

type ResultadoConsulta = Record<string, unknown> | Array<Record<string, unknown>>

export default function ConsultasAvanzadas() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [consultasDisponibles, setConsultasDisponibles] = useState<ConsultaDisponible[]>([])
  const [consultaSeleccionada, setConsultaSeleccionada] = useState<string>("")
  const [parametros, setParametros] = useState<Record<string, string>>({})
  const [resultados, setResultados] = useState<ResultadoConsulta | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
    
    fetchConsultasDisponibles()
  }, [])

  const fetchConsultasDisponibles = async () => {
    try {
      // Backend deshabilitado - Datos mock
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const consultasMock = [
        { id: 'ocupacion', nombre: 'Análisis de Ocupación', descripcion: 'Estadísticas de ocupación por período', parametros: ['fechaInicio', 'fechaFin'] },
        { id: 'ingresos', nombre: 'Reporte de Ingresos', descripcion: 'Desglose de ingresos por fuente', parametros: ['fechaInicio', 'fechaFin'] },
        { id: 'clientes', nombre: 'Análisis de Clientes', descripcion: 'Segmentación y comportamiento de clientes', parametros: [] }
      ]
      
      setConsultasDisponibles(consultasMock)
    } catch (err) {
      setError("Error al cargar consultas disponibles")
      console.error(err)
    }
  }

  const handleConsultaChange = (consultaId: string) => {
    setConsultaSeleccionada(consultaId)
    setParametros({})
    setResultados(null)
    setError("")
  }

  const handleParametroChange = (key: string, value: string | number) => {
    setParametros(prev => ({
      ...prev,
      [key]: String(value)
    }))
  }

  const ejecutarConsulta = async () => {
    if (!consultaSeleccionada) {
      setError("Por favor seleccione un tipo de consulta")
      return
    }

    try {
      setLoading(true)
      setError("")
      
      // Backend deshabilitado - Simular consulta con datos mock
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const resultadosMock = {
        ocupacion: [
          { periodo: 'Enero 2025', ocupacion: 75, habitaciones: 30 },
          { periodo: 'Febrero 2025', ocupacion: 82, habitaciones: 33 },
          { periodo: 'Marzo 2025', ocupacion: 78, habitaciones: 31 }
        ],
        ingresos: [
          { fuente: 'Habitaciones', monto: 1850000 },
          { fuente: 'Servicios', monto: 320000 },
          { fuente: 'Extras', monto: 180000 }
        ],
        clientes: [
          { segmento: 'VIP', cantidad: 45, porcentaje: 15 },
          { segmento: 'Regular', cantidad: 180, porcentaje: 60 },
          { segmento: 'Nuevo', cantidad: 75, porcentaje: 25 }
        ]
      }
      
      const resultado = resultadosMock[consultaSeleccionada as keyof typeof resultadosMock] || []
      setResultados(resultado as ResultadoConsulta)
    } catch (err) {
      setError("Error al ejecutar la consulta")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exportarResultados = () => {
    if (!resultados) return
    
    const dataStr = JSON.stringify(resultados, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `consulta_${consultaSeleccionada}_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const renderParametroInput = (parametro: string) => {
    const value = parametros[parametro] || ""

    switch (parametro) {
      case 'fechaInicio':
      case 'fechaFin':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleParametroChange(parametro, e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
          />
        )
      
      case 'limit':
      case 'offset':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParametroChange(parametro, parseInt(e.target.value) || 0)}
            placeholder={parametro === 'limit' ? '50' : '0'}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          />
        )
      
      case 'minPrecio':
      case 'maxPrecio':
        return (
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => handleParametroChange(parametro, parseFloat(e.target.value) || 0)}
            placeholder={parametro === 'minPrecio' ? 'Precio mínimo' : 'Precio máximo'}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          />
        )
      
      case 'estadoReserva':
        return (
          <select
            value={value}
            onChange={(e) => handleParametroChange(parametro, e.target.value)}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CHECKIN">Check-in</option>
            <option value="CHECKOUT">Check-out</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="NO_SHOW">No Show</option>
          </select>
        )
      
      case 'metodoPago':
        return (
          <select
            value={value}
            onChange={(e) => handleParametroChange(parametro, e.target.value)}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          >
            <option value="">Todos los métodos</option>
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
            <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="STRIPE">Stripe</option>
          </select>
        )
      
      case 'idHabitacion':
      case 'idUsuario':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParametroChange(parametro, e.target.value)}
            placeholder={`ID de ${parametro === 'idHabitacion' ? 'habitación' : 'usuario'}`}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          />
        )
      
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParametroChange(parametro, e.target.value)}
            placeholder={parametro}
            className="w-full px-4 py-3 between border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
          />
        )
    }
  }

  const renderResultados = () => {
    if (!resultados) return null

    if (Array.isArray(resultados)) {
      if (resultados.length === 0) {
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">No se encontraron resultados para esta consulta</p>
          </div>
        )
      }

      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {Object.keys(resultados[0] || {}).map(key => (
                  <th key={key} className="text-left px-4 py-3 font-medium text-gray-700 border-b">
                    {key.replace(/_/g, ' ').toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultados.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {Object.values(item || {}).map((value, valueIndex) => (
                    <td key={valueIndex} className="text-left px-4 py-3 border-b">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="bg-gray-50 rounded-xl p-6">
          <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(resultados, null, 2)}
          </pre>
        </div>
      )
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-admin"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Consultas Avanzadas</h1>
              <p className="text-gray-600">Realiza consultas parametrizadas personalizadas</p>
            </div>
            {resultados && (
              <button
                onClick={exportarResultados}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Exportar JSON
              </button>
            )}
          </div>

          {/* Panel de consultas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel izquierdo - Configuración */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Configurar Consulta
                </h2>

                {/* Selector de consulta */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Consulta
                  </label>
                  <select
                    value={consultaSeleccionada}
                    onChange={(e) => handleConsultaChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                  >
                    <option value="">Selecciona una consulta...</option>
                    {consultasDisponibles.map(consulta => (
                      <option key={consulta.id} value={consulta.id}>
                        {consulta.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Parámetros */}
                {consultaSeleccionada && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Parámetros</h3>
                    <button
                      onClick={ejecutarConsulta}
                      disabled={loading}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader className="h-5 w-5 animate-spin" />
                          Ejecutando...
                        </>
                      ) : (
                        <>
                          <Search className="h-5 w-5" />
                          Ejecutar Consulta
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Descripción de la consulta */}
              {consultaSeleccionada && (
                <div className="bg-blue-50 rounded-3xl p-6 mt-6">
                  <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Descripción
                  </h3>
                  <p className="text-sm text-blue-800">
                    {consultasDisponibles.find(c => c.id === consultaSeleccionada)?.descripcion}
                  </p>
                </div>
              )}
            </div>

            {/* Panel derecho - Resultados */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Resultados
                  </h2>
                  {resultados && (
                    <button
                      onClick={() => setResultados(null)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Loading state */}
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader className="h-8 w-8 text-gray-400 animate-spin" />
                  </div>
                ) : resultados ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      Se encontraron {Array.isArray(resultados) ? resultados.length : 1} resultado(s)
                    </div>
                    {renderResultados()}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Selecciona una consulta y haz clic en &quot;Ejecutar Consulta&quot; para ver los resultados
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
