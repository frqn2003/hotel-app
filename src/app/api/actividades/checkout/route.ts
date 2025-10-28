import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar check-out
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { reservationId, operadorId, metadata } = body

        // Validaciones
        if (!reservationId || !operadorId) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Verificar que la reserva existe
        const reserva = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: {
                user: true,
                room: true,
                payment: true
            }
        })

        if (!reserva) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            )
        }

        // Verificar que la reserva está CONFIRMADA (ya hizo check-in)
        if (reserva.estado !== 'CONFIRMADA') {
            return NextResponse.json(
                { success: false, error: 'La reserva no está en un estado válido para check-out' },
                { status: 400 }
            )
        }

        // Verificar que el pago está completado
        if (!reserva.pagado) {
            return NextResponse.json(
                { success: false, error: 'La reserva debe estar pagada antes de hacer check-out' },
                { status: 400 }
            )
        }

        // Actualizar estado de la habitación a DISPONIBLE
        await prisma.room.update({
            where: { id: reserva.roomId },
            data: { estado: 'DISPONIBLE' }
        })

        // Actualizar estado de la reserva (opcional: crear un estado COMPLETADA)
        // Por ahora la dejamos en CONFIRMADA pero con el check-out registrado

        // Registrar actividad de check-out
        const actividad = await prisma.activity.create({
            data: {
                tipo: 'CHECKOUT',
                descripcion: `Check-out realizado para habitación ${reserva.room.numero}`,
                userId: reserva.userId,
                operadorId,
                reservationId,
                roomId: reserva.roomId,
                metadata: {
                    horaCheckout: new Date().toISOString(),
                    ...metadata
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                operador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                reservation: true,
                room: true
            }
        })

        return NextResponse.json({
            success: true,
            data: actividad,
            message: 'Check-out registrado exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al registrar check-out:', error)
        return NextResponse.json(
            { success: false, error: 'Error al registrar el check-out' },
            { status: 500 }
        )
    }
}
