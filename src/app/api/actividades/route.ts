import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener actividades con filtros
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const tipo = searchParams.get('tipo')
        const userId = searchParams.get('userId')
        const reservationId = searchParams.get('reservationId')
        const roomId = searchParams.get('roomId')
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

        const where: any = {}

        if (tipo) {
            where.tipo = tipo
        }
        if (userId) {
            where.userId = userId
        }
        if (reservationId) {
            where.reservationId = reservationId
        }
        if (roomId) {
            where.roomId = roomId
        }

        const actividades = await prisma.activity.findMany({
            where,
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
                reservation: {
                    select: {
                        id: true,
                        fechaEntrada: true,
                        fechaSalida: true,
                        estado: true
                    }
                },
                room: {
                    select: {
                        numero: true,
                        tipo: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        return NextResponse.json({
            success: true,
            data: actividades,
            total: actividades.length
        })
    } catch (error) {
        console.error('Error al obtener actividades:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener las actividades' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva actividad
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { tipo, descripcion, userId, operadorId, reservationId, roomId, metadata } = body

        // Validaciones
        if (!tipo || !descripcion || !userId) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Validar tipo de actividad
        const tiposValidos = [
            'CHECKIN',
            'CHECKOUT',
            'RESERVA_CREADA',
            'RESERVA_MODIFICADA',
            'RESERVA_CANCELADA',
            'PAGO_PROCESADO',
            'CAMBIO_ESTADO_HABITACION',
            'MANTENIMIENTO_INICIADO',
            'MANTENIMIENTO_COMPLETADO'
        ]

        if (!tiposValidos.includes(tipo)) {
            return NextResponse.json(
                { success: false, error: 'Tipo de actividad inválido' },
                { status: 400 }
            )
        }

        // Crear la actividad
        const nuevaActividad = await prisma.activity.create({
            data: {
                tipo,
                descripcion,
                userId,
                operadorId: operadorId || null,
                reservationId: reservationId || null,
                roomId: roomId || null,
                metadata: metadata || null
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
                reservation: {
                    select: {
                        id: true,
                        fechaEntrada: true,
                        fechaSalida: true
                    }
                },
                room: {
                    select: {
                        numero: true,
                        tipo: true
                    }
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: nuevaActividad,
            message: 'Actividad registrada exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al crear actividad:', error)
        return NextResponse.json(
            { success: false, error: 'Error al registrar la actividad' },
            { status: 500 }
        )
    }
}
