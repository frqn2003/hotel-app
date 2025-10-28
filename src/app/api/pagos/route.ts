import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener pagos con filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const reservationId = searchParams.get('reservationId')
        const estado = searchParams.get('estado')

        const where: any = {}

        if (reservationId) {
            where.reservationId = reservationId
        }
        if (estado) {
            where.estado = estado
        }

        const pagos = await prisma.payment.findMany({
            where,
            include: {
                reservation: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true
                            }
                        },
                        room: {
                            select: {
                                numero: true,
                                tipo: true
                            }
                        }
                    }
                },
                invoice: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: pagos,
            total: pagos.length
        })
    } catch (error) {
        console.error('Error al obtener pagos:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener los pagos' },
            { status: 500 }
        )
    }
}

// POST - Crear nuevo pago
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { reservationId, monto, metodoPago, stripePaymentId } = body

        // Validaciones
        if (!reservationId || !monto || !metodoPago) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Validar que la reserva existe
        const reserva = await prisma.reservation.findUnique({
            where: { id: reservationId }
        })

        if (!reserva) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            )
        }

        // Verificar si ya existe un pago para esta reserva
        const pagoExistente = await prisma.payment.findUnique({
            where: { reservationId }
        })

        if (pagoExistente) {
            return NextResponse.json(
                { success: false, error: 'Ya existe un pago para esta reserva' },
                { status: 400 }
            )
        }

        // Validar método de pago
        const metodosValidos = ['EFECTIVO', 'TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'STRIPE']
        if (!metodosValidos.includes(metodoPago)) {
            return NextResponse.json(
                { success: false, error: 'Método de pago inválido' },
                { status: 400 }
            )
        }

        console.log('💳 Procesando pago:', { reservationId, monto, metodoPago })
        
        // Crear el pago
        const nuevoPago = await prisma.payment.create({
            data: {
                reservationId,
                monto,
                metodoPago,
                stripePaymentId: stripePaymentId || null,
                estado: 'COMPLETADO',
                fechaPago: new Date()
            },
            include: {
                reservation: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                nombre: true,
                                email: true
                            }
                        },
                        room: {
                            select: {
                                numero: true,
                                tipo: true
                            }
                        }
                    }
                }
            }
        })

        // Actualizar el estado de la reserva
        const reservaActualizada = await prisma.reservation.update({
            where: { id: reservationId },
            data: { 
                pagado: true,
                estado: 'CONFIRMADA' // Cambiar de PENDIENTE a CONFIRMADA
            },
            include: {
                room: true
            }
        })

        // Actualizar el estado de la habitación a RESERVADA
        await prisma.room.update({
            where: { id: reservaActualizada.roomId },
            data: { estado: 'RESERVADA' }
        })

        console.log('✅ Pago completado. Reserva y habitación actualizadas:', { 
            reservaId: reservaActualizada.id, 
            pagado: reservaActualizada.pagado, 
            estadoReserva: reservaActualizada.estado,
            habitacionId: reservaActualizada.roomId,
            estadoHabitacion: 'RESERVADA'
        })

        return NextResponse.json({
            success: true,
            data: nuevoPago,
            message: 'Pago procesado exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al crear pago:', error)
        return NextResponse.json(
            { success: false, error: 'Error al procesar el pago' },
            { status: 500 }
        )
    }
}
