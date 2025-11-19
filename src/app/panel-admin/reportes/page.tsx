'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  Eye,
  Loader,
  AlertCircle
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type EstadisticasHabitaciones = {
  resumen: {
    totalHabitaciones: number
    habitacionesOcupadas: number
    habitacionesDisponibles: number
    habitacionesMantenimiento: number
    tasaOcupacion: number
    ingresosTotales: number
    promedioPorReserva: number
    totalReservas: number
  }
  estado: Array<{ estado: string; cantidad: number }>
  porTipo: Array<{ tipo: string; cantidad: number; precioPromedio: number }>
  tendencia: Array<{ mes: string; ingresos: number; ocupacion: number; reservas: number }>
}

type EstadisticasGanancias = {
  resumen: {
    ingresosActuales: number
    ingresosAnteriores: number
    variacion: number
    variacionPorcentaje: string
    totalReservas: number
    promedioPorReserva: number
  }
  porMetodoPago: Array<{ metodo: string; ingresos: number }>
  porEstado: Array<{ estado: string; cantidad: number; ingresos: number }>
  tendencia: Array<{ fecha: string; ingresos: number }>
  top5Habitaciones: Array<{ tipo: string; ingresos: number; reservas: number }>
}

// Colores para los gráficos
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function ReportesFinancieros() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [periodo, setPeriodo] = useState("mes")
  const [estadisticasHabitaciones, setEstadisticasHabitaciones] = useState<EstadisticasHabitaciones | null>(null)
  const [estadisticasGanancias, setEstadisticasGanancias] = useState<EstadisticasGanancias | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR" && userData.rol !== "OPERADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
    
    fetchEstadisticas()
  }, [periodo])

  const fetchEstadisticas = async () => {
    try {
      setLoading(true)
      setError("")
      
      // Backend deshabilitado - Datos mock
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const dataHabitaciones: EstadisticasHabitaciones = {
        resumen: {
          totalHabitaciones: 40,
          habitacionesOcupadas: 28,
          habitacionesDisponibles: 10,
          habitacionesMantenimiento: 2,
          tasaOcupacion: 70,
          ingresosTotales: 0,
          promedioPorReserva: 0,
          totalReservas: 0
        },
        estado: [
          { estado: 'Ocupada', cantidad: 28 },
          { estado: 'Disponible', cantidad: 10 },
          { estado: 'Mantenimiento', cantidad: 2 }
        ],
        porTipo: [
          { tipo: 'SIMPLE', cantidad: 15, precioPromedio: 0 },
          { tipo: 'DOBLE', cantidad: 15, precioPromedio: 0 },
          { tipo: 'SUITE', cantidad: 10, precioPromedio: 0 }
        ],
        tendencia: [
          { mes: 'Enero', ingresos: 0, ocupacion: 65, reservas: 0 },
          { mes: 'Febrero', ingresos: 0, ocupacion: 68, reservas: 0 },
          { mes: 'Marzo', ingresos: 0, ocupacion: 72, reservas: 0 },
          { mes: 'Abril', ingresos: 0, ocupacion: 70, reservas: 0 },
          { mes: 'Mayo', ingresos: 0, ocupacion: 73, reservas: 0 }
        ]
      }
      
      const dataGanancias: EstadisticasGanancias = {
        resumen: {
          ingresosActuales: 2400000,
          ingresosAnteriores: 0,
          variacion: 0,
          variacionPorcentaje: '0%',
          totalReservas: 45,
          promedioPorReserva: 53333
        },
        porMetodoPago: [
          { metodo: 'Tarjeta Crédito', ingresos: 1200000 },
          { metodo: 'Tarjeta Débito', ingresos: 720000 },
          { metodo: 'Efectivo', ingresos: 360000 },
          { metodo: 'Transferencia', ingresos: 120000 }
        ],
        porEstado: [
          { estado: 'COMPLETADO', cantidad: 38, ingresos: 2040000 },
          { estado: 'PENDIENTE', cantidad: 5, ingresos: 270000 },
          { estado: 'CANCELADO', cantidad: 2, ingresos: 90000 }
        ],
        tendencia: [
          { fecha: '01/11', ingresos: 65000 },
          { fecha: '05/11', ingresos: 72000 },
          { fecha: '10/11', ingresos: 85000 },
          { fecha: '15/11', ingresos: 78000 },
          { fecha: '18/11', ingresos: 92000 }
        ],
        top5Habitaciones: [
          { tipo: 'SUITE', ingresos: 850000, reservas: 12 },
          { tipo: 'DOBLE', ingresos: 720000, reservas: 18 },
          { tipo: 'SIMPLE', ingresos: 580000, reservas: 15 },
          { tipo: 'PRESIDENCIAL', ingresos: 150000, reservas: 2 },
          { tipo: 'EJECUTIVA', ingresos: 100000, reservas: 5 }
        ]
      }

      setEstadisticasHabitaciones(dataHabitaciones)
      setEstadisticasGanancias(dataGanancias)
    } catch (err) {
      setError("Error al cargar los reportes")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const exportarPDF = () => {
    alert("Exportando reporte en formato PDF...")
  }

  const exportarExcel = () => {
    alert("Exportando reporte en formato Excel...")
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
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
              <h1 className="text-3xl font-semibold text-gray-900">Reportes Financieros</h1>
              <p className="text-gray-600">Análisis detallado del rendimiento financiero del hotel</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportarExcel}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Excel
              </button>
              <button
                onClick={exportarPDF}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                PDF
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option value="mes">Último Mes</option>
                    <option value="trimestre">Último Trimestre</option>
                    <option value="año">Último Año</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : estadisticasGanancias && estadisticasHabitaciones ? (
            <>
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <DollarSign className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">Ingresos</span>
                    </div>
                    {estadisticasGanancias.resumen.variacion >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">
                    ${estadisticasGanancias.resumen.ingresosActuales.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${estadisticasGanancias.resumen.variacion >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                      {estadisticasGanancias.resumen.variacionPorcentaje}
                    </span>
                    <span className="text-sm text-gray-500">vs período anterior</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Building className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">Ocupación</span>
                    </div>
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">
                    {estadisticasHabitaciones.resumen.tasaOcupacion}%
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-600">
                      {estadisticasHabitaciones.resumen.habitacionesOcupadas}/{estadisticasHabitaciones.resumen.totalHabitaciones}
                    </span>
                    <span className="text-sm text-gray-500">habitaciones</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">Reservas</span>
                    </div>
                    <Activity className="h-5 w-5 text-gray-600" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">
                    {estadisticasGanancias.resumen.totalReservas}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">
                      Promedio: ${estadisticasGanancias.resumen.promedioPorReserva.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <BarChart3 className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">Disponibles</span>
                    </div>
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">
                    {estadisticasHabitaciones.resumen.habitacionesDisponibles}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round((estadisticasHabitaciones.resumen.habitacionesDisponibles / estadisticasHabitaciones.resumen.totalHabitaciones) * 100)}%
                    </span>
                    <span className="text-sm text-gray-500">del total</span>
                  </div>
                </div>
              </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Gráfico de tendencia de ingresos */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tendencia de Ingresos</h2>
                {estadisticasGanancias.tendencia && estadisticasGanancias.tendencia.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={estadisticasGanancias.tendencia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="ingresos" stroke="#3b82f6" strokeWidth={2} name="Ingresos" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No hay datos de ingresos en este período</p>
                  </div>
                )}
              </div>

              {/* Gráfico de pastel - Estado de habitaciones */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Estado de Habitaciones</h2>
                {estadisticasHabitaciones.estado && estadisticasHabitaciones.estado.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPieChart>
                      <Pie
                        data={estadisticasHabitaciones.estado}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.estado}: ${entry.cantidad}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="cantidad"
                      >
                        {estadisticasHabitaciones.estado.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No hay datos de estado de habitaciones</p>
                  </div>
                )}
              </div>

              {/* Gráfico de barras - Habitaciones por tipo */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Habitaciones por Tipo</h2>
                {estadisticasHabitaciones.porTipo && estadisticasHabitaciones.porTipo.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={estadisticasHabitaciones.porTipo}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="cantidad" fill="#10b981" name="Cantidad" />
                      <Bar dataKey="precioPromedio" fill="#f59e0b" name="Precio Promedio" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No hay datos de tipos de habitaciones</p>
                  </div>
                )}
              </div>

              {/* Gráfico de barras - Métodos de pago */}
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Ingresos por Método de Pago</h2>
                {estadisticasGanancias.porMetodoPago && estadisticasGanancias.porMetodoPago.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={estadisticasGanancias.porMetodoPago}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metodo" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="ingresos" fill="#8b5cf6" name="Ingresos" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No hay datos de métodos de pago</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top habitaciones */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Habitaciones por Ingresos</h2>
              {estadisticasGanancias.top5Habitaciones && estadisticasGanancias.top5Habitaciones.length > 0 ? (
                <div className="space-y-4">
                  {estadisticasGanancias.top5Habitaciones.map((hab, index) => (
                    <div key={hab.tipo} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm font-medium text-gray-700">{hab.tipo}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-emerald-500"
                            style={{
                              width: `${(hab.ingresos / Math.max(...estadisticasGanancias.top5Habitaciones.map(h => h.ingresos))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">${hab.ingresos.toLocaleString()}</p>
                          <p className="text-xs text-gray-500">{hab.reservas} reservas</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-gray-500">No hay datos de habitaciones en este período</p>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
    <Footer />
  </> 
)
}