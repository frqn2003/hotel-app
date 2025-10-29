import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST - Registrar check-in
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
                room: true
            }
        })

        if (!reserva) {
            return NextResponse.json(
                { success: false, error: 'Reserva no encontrada' },
                { status: 404 }
            )
        }

        // Verificar que la reserva está en estado CONFIRMADA
        if (reserva.estado !== 'CONFIRMADA' && reserva.estado !== 'PENDIENTE') {
            return NextResponse.json(
                { success: false, error: 'La reserva no está en un estado válido para check-in' },
                { status: 400 }
            )
        }

        // Actualizar estado de la reserva a CONFIRMADA si estaba PENDIENTE
        if (reserva.estado === 'PENDIENTE') {
            await prisma.reservation.update({
                where: { id: reservationId },
                data: { estado: 'CONFIRMADA' }
            })
        }

        // Actualizar estado de la habitación a OCUPADA
        await prisma.room.update({
            where: { id: reserva.roomId },
            data: { estado: 'OCUPADA' }
        })

        // Registrar actividad de check-in
        const actividad = await prisma.activity.create({
            data: {
                tipo: 'CHECKIN',
                descripcion: `Check-in realizado para habitación ${reserva.room.numero}`,
                userId: reserva.userId,
                operadorId,
                reservationId,
                roomId: reserva.roomId,
                metadata: {
                    horaCheckin: new Date().toISOString(),
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
            message: 'Check-in registrado exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al registrar check-in:', error)
        return NextResponse.json(
            { success: false, error: 'Error al registrar el check-in' },
            { status: 500 }
        )
    }
}
