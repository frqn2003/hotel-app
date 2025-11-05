import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const periodo = searchParams.get("periodo") || "mes" // mes, trimestre, año

    // Obtener estado actual de habitaciones
    const habitacionesEstado = await prisma.room.groupBy({
      by: ["estado"],
      _count: true
    })

    // Obtener ocupación por tipo de habitación
    const ocupacionPorTipo = await prisma.room.groupBy({
      by: ["tipo"],
      _count: true,
      _avg: {
        precio: true
      }
    })

    // Calcular fechas según período
    const ahora = new Date()
    let fechaInicio = new Date()

    if (periodo === "mes") {
      fechaInicio.setMonth(ahora.getMonth() - 1)
    } else if (periodo === "trimestre") {
      fechaInicio.setMonth(ahora.getMonth() - 3)
    } else if (periodo === "año") {
      fechaInicio.setFullYear(ahora.getFullYear() - 1)
    }

    // Obtener reservas en el período
    const reservasEnPeriodo = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: fechaInicio,
          lte: ahora
        }
      },
      include: {
        room: true,
        payment: true
      }
    })

    // Calcular métricas
    const totalHabitaciones = await prisma.room.count()
    const habitacionesOcupadas = habitacionesEstado.find(h => h.estado === "OCUPADA")?._count || 0
    const habitacionesDisponibles = habitacionesEstado.find(h => h.estado === "DISPONIBLE")?._count || 0
    const habitacionesMantenimiento = habitacionesEstado.find(h => h.estado === "MANTENIMIENTO")?._count || 0

    const tasaOcupacion = totalHabitaciones > 0 ? Math.round((habitacionesOcupadas / totalHabitaciones) * 100) : 0

    // Ingresos totales en el período
    const ingresosTotales = reservasEnPeriodo.reduce((sum, r) => sum + r.precioTotal, 0)

    // Agrupar por mes para gráfico de tendencia
    const datosGrafico: any[] = []
    const meses = 12
    for (let i = meses - 1; i >= 0; i--) {
      const fecha = new Date(ahora)
      fecha.setMonth(ahora.getMonth() - i)
      const mesInicio = new Date(fecha.getFullYear(), fecha.getMonth(), 1)
      const mesFin = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0)

      const reservasMes = reservasEnPeriodo.filter(r => {
        const fechaRes = new Date(r.createdAt)
        return fechaRes >= mesInicio && fechaRes <= mesFin
      })

      const ingresosMes = reservasMes.reduce((sum, r) => sum + r.precioTotal, 0)
      const ocupacionMes = reservasMes.length

      datosGrafico.push({
        mes: fecha.toLocaleString("es-ES", { month: "short", year: "2-digit" }),
        ingresos: ingresosMes,
        ocupacion: ocupacionMes,
        reservas: reservasMes.length
      })
    }

    await prisma.$disconnect()

    return NextResponse.json({
      resumen: {
        totalHabitaciones,
        habitacionesOcupadas,
        habitacionesDisponibles,
        habitacionesMantenimiento,
        tasaOcupacion,
        ingresosTotales,
        promedioPorReserva: reservasEnPeriodo.length > 0 ? Math.round(ingresosTotales / reservasEnPeriodo.length) : 0,
        totalReservas: reservasEnPeriodo.length
      },
      estado: habitacionesEstado.map(h => ({
        estado: h.estado,
        cantidad: h._count
      })),
      porTipo: ocupacionPorTipo.map(t => ({
        tipo: t.tipo,
        cantidad: t._count,
        precioPromedio: Math.round(t._avg.precio || 0)
      })),
      tendencia: datosGrafico
    })
  } catch (error) {
    console.error("Error fetching estadísticas:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
