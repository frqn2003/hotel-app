// Componente para métricas del dashboard del operador

'use client'

import { useReservasHoy } from '@/hooks'
import { useHabitaciones } from '@/hooks'
import { UserCheck, Key, Building, AlertTriangle } from 'lucide-react'

export default function MetricasDashboard() {
  const { checkinsHoy, checkoutsHoy, loading: loadingReservas } = useReservasHoy()
  const { habitaciones, loading: loadingHabs } = useHabitaciones()

  if (loadingReservas || loadingHabs) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-32"></div>
        ))}
      </div>
    )
  }

  const checkinsCompletados = checkinsHoy.filter(r => r.estado === 'CHECKIN').length
  const checkinsPendientes = checkinsHoy.filter(r => r.estado === 'CONFIRMADA').length
  
  const checkoutsCompletados = checkoutsHoy.filter(r => r.estado === 'CHECKOUT').length
  const checkoutsPendientes = checkoutsHoy.filter(r => r.estado === 'CHECKIN').length

  const habitacionesOcupadas = habitaciones.filter(h => h.estado === 'OCUPADA').length
  const ocupacionPorcentaje = habitaciones.length > 0 
    ? Math.round((habitacionesOcupadas / habitaciones.length) * 100) 
    : 0

  const tareasPendientes = checkinsPendientes + checkoutsPendientes

  const metricasPanel = [
    {
      etiqueta: "Check-ins hoy",
      valor: checkinsHoy.length.toString(),
      descripcion: `${checkinsCompletados} completados • ${checkinsPendientes} pendientes`,
      icon: UserCheck,
      tendencia: checkinsPendientes === 0 ? "positive" : "neutral"
    },
    {
      etiqueta: "Check-outs hoy",
      valor: checkoutsHoy.length.toString(),
      descripcion: `${checkoutsCompletados} completados • ${checkoutsPendientes} pendientes`,
      icon: Key,
      tendencia: checkoutsPendientes === 0 ? "positive" : "neutral"
    },
    {
      etiqueta: "Habitaciones ocupadas",
      valor: habitacionesOcupadas.toString(),
      descripcion: `${ocupacionPorcentaje}% de ocupación actual`,
      icon: Building,
      tendencia: ocupacionPorcentaje > 80 ? "positive" : "neutral"
    },
    {
      etiqueta: "Tareas pendientes",
      valor: tareasPendientes.toString(),
      descripcion: tareasPendientes > 5 ? `${tareasPendientes} requieren atención` : 'Todo bajo control',
      icon: AlertTriangle,
      tendencia: tareasPendientes > 5 ? "negative" : "positive"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricasPanel.map((dato) => {
        const Icono = dato.icon
        const colorTendencia = dato.tendencia === "positive" 
          ? "text-emerald-600" 
          : dato.tendencia === "negative" 
            ? "text-red-600" 
            : "text-gray-600"
        
        return (
          <div
            key={dato.etiqueta}
            className="bg-[#F8FBFF] border border-gray-100 rounded-2xl p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`h-11 w-11 rounded-full ${
                  dato.tendencia === "negative" ? "bg-red-500" : "bg-black/90"
                } text-white flex items-center justify-center`}>
                  <Icono className="h-5 w-5" />
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  {dato.etiqueta}
                </span>
              </div>
            </div>
            <p className="text-3xl font-semibold text-gray-900">{dato.valor}</p>
            <p className={`text-sm ${colorTendencia}`}>{dato.descripcion}</p>
          </div>
        )
      })}
    </div>
  )
}
