import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Consultas parametrizadas avanzadas
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tipoConsulta, 
      fechaInicio, 
      fechaFin, 
      idHabitacion, 
      idUsuario, 
      estadoReserva,
      metodoPago,
      minPrecio,
      maxPrecio,
      limit = 50,
      offset = 0
    } = body;

    let resultado: any = {};

    switch (tipoConsulta) {
      case 'reservas_por_periodo':
        // Reservas en un rango de fechas
        resultado = await prisma.reservation.findMany({
          where: {
            fechaEntrada: {
              gte: fechaInicio ? new Date(fechaInicio) : undefined,
              lte: fechaFin ? new Date(fechaFin) : undefined
            },
            ...(estadoReserva && { estado: estadoReserva })
          },
          include: {
            user: {
              select: { nombre: true, email: true }
            },
            room: {
              select: { numero: true, tipo: true, precio: true }
            }
          },
          orderBy: { fechaEntrada: 'desc' },
          take: parseInt(limit),
          skip: parseInt(offset)
        });
        break;

      case 'ocupacion_habitaciones':
        // Ocupación de habitaciones específicas
        resultado = await prisma.reservation.groupBy({
          by: ['roomId'],
          where: {
            fechaEntrada: {
              gte: fechaInicio ? new Date(fechaInicio) : undefined,
              lte: fechaFin ? new Date(fechaFin) : undefined
            },
            ...(idHabitacion && { roomId: idHabitacion })
          },
          _count: {
            id: true
          },
          _sum: {
            precioTotal: true
          }
        });

        // Obtener detalles de las habitaciones
        const habitacionesIds = resultado.map((r: any) => r.roomId);
        const habitaciones = await prisma.room.findMany({
          where: { id: { in: habitacionesIds } },
          select: { id: true, numero: true, tipo: true, precio: true }
        });

        resultado = resultado.map((r: any) => {
          const habitacion = habitaciones.find((h: any) => h.id === r.roomId);
          return {
            ...r,
            habitacion
          };
        });
        break;

      case 'ingresos_por_metodo_pago':
        // Ingresos agrupados por método de pago
        resultado = await prisma.payment.groupBy({
          by: ['metodoPago'],
          where: {
            fechaPago: {
              gte: fechaInicio ? new Date(fechaInicio) : undefined,
              lte: fechaFin ? new Date(fechaFin) : undefined
            },
            ...(metodoPago && { metodoPago })
          },
          _sum: {
            monto: true
          },
          _count: {
            id: true
          }
        });
        break;

      case 'clientes_frecuentes':
        // Clientes con más reservas
        resultado = await prisma.reservation.groupBy({
          by: ['userId'],
          where: {
            fechaEntrada: {
              gte: fechaInicio ? new Date(fechaInicio) : undefined,
              lte: fechaFin ? new Date(fechaFin) : undefined
            }
          },
          _count: {
            id: true
          },
          _sum: {
            precioTotal: true
          },
          orderBy: {
            _count: {
              id: 'desc'
            }
          },
          take: parseInt(limit)
        });

        // Obtener detalles de los usuarios
        const usuariosIds = resultado.map((r: any) => r.userId);
        const usuarios = await prisma.user.findMany({
          where: { id: { in: usuariosIds } },
          select: { id: true, nombre: true, email: true, telefono: true }
        });

        resultado = resultado.map((r: any) => {
          const usuario = usuarios.find((u: any) => u.id === r.userId);
          return {
            ...r,
            usuario
          };
        });
        break;

      case 'habitaciones_mas_rentables':
        // Habitaciones ordenadas por ingresos generados
        resultado = await prisma.reservation.groupBy({
          by: ['roomId'],
          where: {
            fechaEntrada: {
              gte: fechaInicio ? new Date(fechaInicio) : undefined,
              lte: fechaFin ? new Date(fechaFin) : undefined
            },
            ...(minPrecio && { 
              room: { 
                precio: { gte: parseFloat(minPrecio) } 
              } 
            }),
            ...(maxPrecio && { 
              room: { 
                precio: { lte: parseFloat(maxPrecio) } 
              } 
            })
          },
          _count: {
            id: true
          },
          _sum: {
            precioTotal: true
          },
          orderBy: {
            _sum: {
              precioTotal: 'desc'
            }
          },
          take: parseInt(limit)
        });

        // Obtener detalles de las habitaciones
        const habitacionesRentablesIds = resultado.map((r: any) => r.roomId);
        const habitacionesRentables = await prisma.room.findMany({
          where: { id: { in: habitacionesRentablesIds } },
          select: { id: true, numero: true, tipo: true, precio: true, estado: true }
        });

        resultado = resultado.map((r: any) => {
          const habitacion = habitacionesRentables.find((h: any) => h.id === r.roomId);
          return {
            ...r,
            habitacion
          };
        });
        break;

      case 'tendencia_ocupacion_mensual':
        // Tendencia de ocupación por mes
        resultado = await prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', fecha_entrada) as mes,
            COUNT(*) as total_reservas,
            COUNT(DISTINCT room_id) as habitaciones_unicas,
            SUM(precio_total) as ingresos_totales
          FROM reservations 
          WHERE fecha_entrada >= ${fechaInicio ? new Date(fechaInicio) : new Date('2000-01-01')}
            AND fecha_entrada <= ${fechaFin ? new Date(fechaFin) : new Date()}
          GROUP BY DATE_TRUNC('month', fecha_entrada)
          ORDER BY mes DESC
          LIMIT ${limit}
        `;
        break;

      case 'estadisticas_operador':
        // Estadísticas de un operador específico
        if (!idUsuario) {
          return NextResponse.json(
            { error: "ID de operador requerido para esta consulta" },
            { status: 400 }
          );
        }

        resultado = await prisma.user.findUnique({
          where: { id: idUsuario },
          select: {
            id: true,
            nombre: true,
            email: true,
            createdAt: true,
            _count: {
              select: {
                reservations: true,
                contactsAsOperador: true
              }
            }
          }
        });

        if (resultado) {
          // Obtener detalles adicionales
          const reservasOperador = await prisma.reservation.findMany({
            where: { userId: idUsuario },
            select: {
              precioTotal: true,
              estado: true,
              createdAt: true
            }
          });

          const ingresosTotales = reservasOperador.reduce((sum, r) => sum + r.precioTotal, 0);
          const reservasPorEstado = reservasOperador.reduce((acc, r) => {
            acc[r.estado] = (acc[r.estado] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          resultado = {
            ...resultado,
            ingresosTotales,
            reservasPorEstado,
            promedioReserva: reservasOperador.length > 0 ? ingresosTotales / reservasOperador.length : 0
          };
        }
        break;

      default:
        return NextResponse.json(
          { error: "Tipo de consulta no válido" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: resultado,
      tipoConsulta,
      parametros: {
        fechaInicio,
        fechaFin,
        idHabitacion,
        idUsuario,
        estadoReserva,
        metodoPago,
        minPrecio,
        maxPrecio,
        limit,
        offset
      }
    });

  } catch (error) {
    console.error('Error en consulta avanzada:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET: Obtener tipos de consultas disponibles
export async function GET() {
  try {
    const consultasDisponibles = [
      {
        id: 'reservas_por_periodo',
        nombre: 'Reservas por Período',
        descripcion: 'Obtener reservas en un rango de fechas específico',
        parametros: ['fechaInicio', 'fechaFin', 'estadoReserva', 'limit', 'offset']
      },
      {
        id: 'ocupacion_habitaciones',
        nombre: 'Ocupación de Habitaciones',
        descripcion: 'Estadísticas de ocupación por habitación',
        parametros: ['fechaInicio', 'fechaFin', 'idHabitacion', 'limit', 'offset']
      },
      {
        id: 'ingresos_por_metodo_pago',
        nombre: 'Ingresos por Método de Pago',
        descripcion: 'Ingresos agrupados por método de pago',
        parametros: ['fechaInicio', 'fechaFin', 'metodoPago', 'limit', 'offset']
      },
      {
        id: 'clientes_frecuentes',
        nombre: 'Clientes Frecuentes',
        descripcion: 'Clientes con mayor número de reservas',
        parametros: ['fechaInicio', 'fechaFin', 'limit', 'offset']
      },
      {
        id: 'habitaciones_mas_rentables',
        nombre: 'Habitaciones Más Rentables',
        descripcion: 'Habitaciones ordenadas por ingresos generados',
        parametros: ['fechaInicio', 'fechaFin', 'minPrecio', 'maxPrecio', 'limit', 'offset']
      },
      {
        id: 'tendencia_ocupacion_mensual',
        nombre: 'Tendencia de Ocupación Mensual',
        descripcion: 'Evolución de la ocupación mes a mes',
        parametros: ['fechaInicio', 'fechaFin', 'limit']
      },
      {
        id: 'estadisticas_operador',
        nombre: 'Estadísticas de Operador',
        descripcion: 'Estadísticas detalladas de un operador específico',
        parametros: ['idUsuario', 'fechaInicio', 'fechaFin']
      }
    ];

    return NextResponse.json({
      success: true,
      data: consultasDisponibles
    });

  } catch (error) {
    console.error('Error al obtener consultas disponibles:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
