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
  Eye
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type MetricaFinanciera = {
  etiqueta: string
  valor: string
  variacion: string
  tendencia: "up" | "down" | "neutral"
  icon: any
  descripcion: string
}

type Transaccion = {
  id: string
  fecha: string
  descripcion: string
  tipo: "ingreso" | "egreso"
  monto: number
  categoria: string
  metodoPago: string
}

type DatosGrafico = {
  mes: string
  ingresos: number
  egresos: number
  ocupacion: number
}

const metricasFinancieras: MetricaFinanciera[] = [
  {
    etiqueta: "Ingresos Mensuales",
    valor: "$ 2.450.000",
    variacion: "+12.5%",
    tendencia: "up",
    icon: DollarSign,
    descripcion: "vs mes anterior"
  },
  {
    etiqueta: "Ganancias Netas",
    valor: "$ 1.870.000",
    variacion: "+8.2%",
    tendencia: "up",
    icon: TrendingUp,
    descripcion: "Margen: 76.3%"
  },
  {
    etiqueta: "Ocupación Promedio",
    valor: "78.4%",
    variacion: "+5.1%",
    tendencia: "up",
    icon: Building,
    descripcion: "Meta: 85%"
  },
  {
    etiqueta: "Ticket Promedio",
    valor: "$ 124.500",
    variacion: "-2.3%",
    tendencia: "down",
    icon: Users,
    descripcion: "por reserva"
  }
]

const transaccionesRecientes: Transaccion[] = [
  {
    id: "T-001",
    fecha: "15 Nov 2025",
    descripcion: "Suite Presidencial - Ana Martínez",
    tipo: "ingreso",
    monto: 350000,
    categoria: "Hospedaje",
    metodoPago: "Tarjeta Crédito"
  },
  {
    id: "T-002",
    fecha: "15 Nov 2025",
    descripcion: "Servicios de Spa",
    tipo: "ingreso",
    monto: 45000,
    categoria: "Servicios",
    metodoPago: "Efectivo"
  },
  {
    id: "T-003",
    fecha: "14 Nov 2025",
    descripcion: "Pago proveedor alimentos",
    tipo: "egreso",
    monto: 185000,
    categoria: "Alimentos/Bebidas",
    metodoPago: "Transferencia"
  },
  {
    id: "T-004",
    fecha: "14 Nov 2025",
    descripcion: "Suite Deluxe - María González",
    tipo: "ingreso",
    monto: 215000,
    categoria: "Hospedaje",
    metodoPago: "Tarjeta Débito"
  },
  {
    id: "T-005",
    fecha: "13 Nov 2025",
    descripcion: "Mantenimiento general",
    tipo: "egreso",
    monto: 75000,
    categoria: "Mantenimiento",
    metodoPago: "Transferencia"
  }
]

const datosGrafico: DatosGrafico[] = [
  { mes: "Ene", ingresos: 1850000, egresos: 450000, ocupacion: 65 },
  { mes: "Feb", ingresos: 1950000, egresos: 480000, ocupacion: 68 },
  { mes: "Mar", ingresos: 2100000, egresos: 520000, ocupacion: 72 },
  { mes: "Abr", ingresos: 1980000, egresos: 510000, ocupacion: 70 },
  { mes: "May", ingresos: 2250000, egresos: 550000, ocupacion: 75 },
  { mes: "Jun", ingresos: 2350000, egresos: 580000, ocupacion: 78 },
  { mes: "Jul", ingresos: 2450000, egresos: 600000, ocupacion: 82 },
  { mes: "Ago", ingresos: 2400000, egresos: 590000, ocupacion: 80 },
  { mes: "Sep", ingresos: 2300000, egresos: 570000, ocupacion: 77 },
  { mes: "Oct", ingresos: 2180000, egresos: 530000, ocupacion: 73 },
  { mes: "Nov", ingresos: 2450000, egresos: 580000, ocupacion: 78 },
  { mes: "Dic", ingresos: 2600000, egresos: 620000, ocupacion: 85 }
]

const categoriasIngresos = [
  { nombre: "Hospedaje", monto: 1845000, porcentaje: 75.3, color: "bg-blue-500" },
  { nombre: "Alimentos/Bebidas", monto: 285000, porcentaje: 11.6, color: "bg-green-500" },
  { nombre: "Spa & Wellness", monto: 156000, porcentaje: 6.4, color: "bg-purple-500" },
  { nombre: "Eventos", monto: 98000, porcentaje: 4.0, color: "bg-amber-500" },
  { nombre: "Otros", monto: 51000, porcentaje: 2.1, color: "bg-gray-500" }
]

const categoriasEgresos = [
  { nombre: "Nómina", monto: 850000, porcentaje: 42.5, color: "bg-red-500" },
  { nombre: "Alimentos/Bebidas", monto: 320000, porcentaje: 16.0, color: "bg-orange-500" },
  { nombre: "Mantenimiento", monto: 285000, porcentaje: 14.3, color: "bg-yellow-500" },
  { nombre: "Servicios", monto: 245000, porcentaje: 12.3, color: "bg-green-500" },
  { nombre: "Marketing", monto: 185000, porcentaje: 9.3, color: "bg-blue-500" },
  { nombre: "Administrativo", monto: 115000, porcentaje: 5.8, color: "bg-purple-500" }
]

export default function ReportesFinancieros() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [periodo, setPeriodo] = useState("mensual")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")

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

    // Establecer fechas por defecto (último mes)
    const hoy = new Date()
    const haceUnMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate())
    
    setFechaDesde(haceUnMes.toISOString().split('T')[0])
    setFechaHasta(hoy.toISOString().split('T')[0])
  }, [])

  const generarReporte = () => {
    // Aquí iría la lógica para generar el reporte con los filtros aplicados
    alert(`Generando reporte ${periodo} desde ${fechaDesde} hasta ${fechaHasta}`)
  }

  const exportarPDF = () => {
    alert("Exportando reporte en formato PDF...")
  }

  const exportarExcel = () => {
    alert("Exportando reporte en formato Excel...")
  }

  const getTendenciaColor = (tendencia: string) => {
    return tendencia === "up" ? "text-emerald-600" : tendencia === "down" ? "text-red-600" : "text-gray-600"
  }

  const getTendenciaIcon = (tendencia: string) => {
    return tendencia === "up" ? TrendingUp : tendencia === "down" ? TrendingDown : Activity
  }

  // Calcular totales
  const totalIngresos = categoriasIngresos.reduce((sum, cat) => sum + cat.monto, 0)
  const totalEgresos = categoriasEgresos.reduce((sum, cat) => sum + cat.monto, 0)
  const gananciaNeta = totalIngresos - totalEgresos
  const margenGanancia = ((gananciaNeta / totalIngresos) * 100).toFixed(1)

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                    <option value="trimestral">Trimestral</option>
                    <option value="anual">Anual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={fechaDesde}
                    onChange={(e) => setFechaDesde(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={fechaHasta}
                    onChange={(e) => setFechaHasta(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    onClick={generarReporte}
                    className="w-full bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Filter className="h-5 w-5" />
                    Aplicar Filtros
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricasFinancieras.map((metrica) => {
              const Icono = metrica.icon
              const TendenciaIcon = getTendenciaIcon(metrica.tendencia)
              return (
                <div key={metrica.etiqueta} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="h-12 w-12 rounded-full bg-black/90 text-white flex items-center justify-center">
                        <Icono className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-medium text-gray-500">{metrica.etiqueta}</span>
                    </div>
                    <TendenciaIcon className={`h-5 w-5 ${getTendenciaColor(metrica.tendencia)}`} />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">{metrica.valor}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getTendenciaColor(metrica.tendencia)}`}>
                      {metrica.variacion}
                    </span>
                    <span className="text-sm text-gray-500">{metrica.descripcion}</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Gráficos y análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Gráfico de ingresos vs egresos */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Ingresos vs Egresos</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-600">Ingresos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Egresos</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {datosGrafico.map((mes, index) => (
                  <div key={mes.mes} className="flex flex-col items-center gap-2 flex-1">
                    <div className="flex flex-col items-center gap-1 w-full">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(mes.ingresos / 2600000) * 120}px` }}
                        title={`Ingresos: $${mes.ingresos.toLocaleString()}`}
                      ></div>
                      <div 
                        className="w-full bg-red-500 rounded-t transition-all hover:bg-red-600"
                        style={{ height: `${(mes.egresos / 620000) * 120}px` }}
                        title={`Egresos: $${mes.egresos.toLocaleString()}`}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{mes.mes}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución de ingresos */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Distribución de Ingresos</h2>
                <PieChart className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-4">
                {categoriasIngresos.map((categoria) => (
                  <div key={categoria.nombre} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categoria.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{categoria.nombre}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${categoria.color}`}
                          style={{ width: `${categoria.porcentaje}%` }}
                        ></div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">${categoria.monto.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">{categoria.porcentaje}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Resumen financiero y transacciones */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resumen financiero */}
            <div className="lg:col-span-1 bg-white rounded-3xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen Financiero</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-2xl">
                  <div>
                    <p className="text-sm text-gray-600">Ingresos Totales</p>
                    <p className="text-lg font-semibold text-gray-900">${totalIngresos.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-2xl">
                  <div>
                    <p className="text-sm text-gray-600">Egresos Totales</p>
                    <p className="text-lg font-semibold text-gray-900">${totalEgresos.toLocaleString()}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-2xl">
                  <div>
                    <p className="text-sm text-gray-600">Ganancia Neta</p>
                    <p className="text-lg font-semibold text-gray-900">${gananciaNeta.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-2xl">
                  <div>
                    <p className="text-sm text-gray-600">Margen de Ganancia</p>
                    <p className="text-lg font-semibold text-gray-900">{margenGanancia}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Transacciones recientes */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Transacciones Recientes</h2>
                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Ver todas
                </button>
              </div>
              <div className="space-y-4">
                {transaccionesRecientes.map((transaccion) => (
                  <div key={transaccion.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transaccion.tipo === "ingreso" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                      }`}>
                        {transaccion.tipo === "ingreso" ? 
                          <TrendingUp className="h-5 w-5" /> : 
                          <TrendingDown className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{transaccion.descripcion}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{transaccion.fecha}</span>
                          <span>•</span>
                          <span>{transaccion.categoria}</span>
                          <span>•</span>
                          <span>{transaccion.metodoPago}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaccion.tipo === "ingreso" ? "text-emerald-600" : "text-red-600"
                      }`}>
                        {transaccion.tipo === "ingreso" ? "+" : "-"}${transaccion.monto.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{transaccion.tipo}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Análisis de egresos */}
          <div className="mt-8 bg-white rounded-3xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Análisis Detallado de Egresos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriasEgresos.map((categoria) => (
                <div key={categoria.nombre} className="border border-gray-200 rounded-2xl p-4 hover:border-gray-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900">{categoria.nombre}</span>
                    <div className={`w-3 h-3 rounded-full ${categoria.color}`}></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Monto:</span>
                      <span className="font-semibold">${categoria.monto.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Porcentaje:</span>
                      <span className="font-semibold">{categoria.porcentaje}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${categoria.color}`}
                        style={{ width: `${categoria.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}