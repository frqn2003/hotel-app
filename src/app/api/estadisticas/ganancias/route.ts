import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const periodo = searchParams.get("periodo") || "mes" // mes, trimestre, año

    // Calcular fechas según período
    const ahora = new Date()
    ahora.setHours(23, 59, 59, 999) // Fin del día actual
    
    let fechaInicio = new Date(ahora)
    let periodoAnteriorInicio = new Date(ahora)
    let periodoAnteriorFin = new Date(ahora)

    if (periodo === "mes") {
      fechaInicio.setDate(1) // Primer día del mes actual
      fechaInicio.setHours(0, 0, 0, 0)
      periodoAnteriorInicio.setMonth(ahora.getMonth() - 1)
      periodoAnteriorInicio.setDate(1)
      periodoAnteriorInicio.setHours(0, 0, 0, 0)
      periodoAnteriorFin.setDate(0) // Último día del mes anterior
      periodoAnteriorFin.setHours(23, 59, 59, 999)
    } else if (periodo === "trimestre") {
      const trimestre = Math.floor(ahora.getMonth() / 3)
      fechaInicio.setMonth(trimestre * 3, 1)
      fechaInicio.setHours(0, 0, 0, 0)
      periodoAnteriorInicio.setMonth((trimestre - 1) * 3, 1)
      periodoAnteriorInicio.setHours(0, 0, 0, 0)
      periodoAnteriorFin.setMonth(trimestre * 3, 0)
      periodoAnteriorFin.setHours(23, 59, 59, 999)
    } else if (periodo === "año") {
      fechaInicio.setMonth(0, 1)
      fechaInicio.setHours(0, 0, 0, 0)
      periodoAnteriorInicio.setFullYear(ahora.getFullYear() - 1, 0, 1)
      periodoAnteriorInicio.setHours(0, 0, 0, 0)
      periodoAnteriorFin.setFullYear(ahora.getFullYear(), 0, 0)
      periodoAnteriorFin.setHours(23, 59, 59, 999)
    }

    // Obtener reservas en el período actual
    const reservasActuales = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: fechaInicio,
          lte: ahora
        }
      },
      include: {
        payment: true,
        room: true
      }
    })

    // Obtener reservas en el período anterior
    const reservasAnteriores = await prisma.reservation.findMany({
      where: {
        createdAt: {
          gte: periodoAnteriorInicio,
          lt: periodoAnteriorFin
        }
      },
      include: {
        payment: true,
        room: true
      }
    })

    // Calcular ingresos
    const ingresosActuales = reservasActuales.reduce((sum, r) => sum + r.precioTotal, 0)
    const ingresosAnteriores = reservasAnteriores.reduce((sum, r) => sum + r.precioTotal, 0)

    // Calcular variación
    const variacion = ingresosAnteriores > 0 
      ? Math.round(((ingresosActuales - ingresosAnteriores) / ingresosAnteriores) * 100)
      : 0

    // Calcular por método de pago
    const porMetodoPago: any = {}
    reservasActuales.forEach(r => {
      if (r.payment) {
        const metodo = r.payment.metodoPago
        if (!porMetodoPago[metodo]) {
          porMetodoPago[metodo] = 0
        }
        porMetodoPago[metodo] += r.precioTotal
      }
    })

    // Calcular por estado de reserva
    const porEstado: any = {}
    reservasActuales.forEach(r => {
      if (!porEstado[r.estado]) {
        porEstado[r.estado] = { cantidad: 0, ingresos: 0 }
      }
      porEstado[r.estado].cantidad += 1
      porEstado[r.estado].ingresos += r.precioTotal
    })

    // Agrupar por día para gráfico de tendencia (últimos 10 días)
    const datosGrafico: any = {}
    const diasMostrados = 10
    
    for (let i = diasMostrados - 1; i >= 0; i--) {
      const fecha = new Date(ahora)
      fecha.setDate(fecha.getDate() - i)
      const diaInicio = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
      const diaFin = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1)

      const reservasDia = reservasActuales.filter(r => {
        const fechaRes = new Date(r.createdAt)
        return fechaRes >= diaInicio && fechaRes < diaFin
      })

      const ingresosDia = reservasDia.reduce((sum, r) => sum + r.precioTotal, 0)

      const clave = fecha.toLocaleDateString("es-ES", { month: "short", day: "numeric" })
      datosGrafico[clave] = ingresosDia
    }

    // Convertir a array ordenado
    const datosGraficoArray = Object.entries(datosGrafico).map(([fecha, ingresos]) => ({
      fecha,
      ingresos: ingresos as number
    }))

    // Top 5 habitaciones por ingresos
    const top5Habitaciones: any = {}
    reservasActuales.forEach(r => {
      const tipoHabitacion = r.room.tipo
      if (!top5Habitaciones[tipoHabitacion]) {
        top5Habitaciones[tipoHabitacion] = { ingresos: 0, reservas: 0 }
      }
      top5Habitaciones[tipoHabitacion].ingresos += r.precioTotal
      top5Habitaciones[tipoHabitacion].reservas += 1
    })

    const top5Array = Object.entries(top5Habitaciones)
      .map(([tipo, data]: any) => ({
        tipo,
        ingresos: data.ingresos,
        reservas: data.reservas
      }))
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5)

    await prisma.$disconnect()

    return NextResponse.json({
      resumen: {
        ingresosActuales,
        ingresosAnteriores,
        variacion,
        variacionPorcentaje: `${variacion > 0 ? "+" : ""}${variacion}%`,
        totalReservas: reservasActuales.length,
        promedioPorReserva: reservasActuales.length > 0 ? Math.round(ingresosActuales / reservasActuales.length) : 0
      },
      porMetodoPago: Object.entries(porMetodoPago).map(([metodo, ingresos]) => ({
        metodo,
        ingresos: ingresos as number
      })),
      porEstado: Object.entries(porEstado).map(([estado, data]: any) => ({
        estado,
        cantidad: data.cantidad,
        ingresos: data.ingresos
      })),
      tendencia: datosGraficoArray,
      top5Habitaciones: top5Array
    })
  } catch (error) {
    console.error("Error fetching ganancias:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al obtener ganancias" },
      { status: 500 }
    )
  }
}
