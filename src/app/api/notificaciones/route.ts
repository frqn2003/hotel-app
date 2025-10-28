import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener notificaciones del usuario
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const leido = searchParams.get('leido')
        const tipo = searchParams.get('tipo')
        const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId es requerido' },
                { status: 400 }
            )
        }

        const where: any = { userId }

        if (leido !== null && leido !== undefined) {
            where.leido = leido === 'true'
        }
        if (tipo) {
            where.tipo = tipo
        }

        const notificaciones = await prisma.notification.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            take: limit
        })

        const noLeidas = await prisma.notification.count({
            where: {
                userId,
                leido: false
            }
        })

        return NextResponse.json({
            success: true,
            data: notificaciones,
            total: notificaciones.length,
            noLeidas
        })
    } catch (error) {
        console.error('Error al obtener notificaciones:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener las notificaciones' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva notificación
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId, titulo, mensaje, tipo, enlace } = body

        // Validaciones
        if (!userId || !titulo || !mensaje || !tipo) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Validar tipo de notificación
        const tiposValidos = ['INFO', 'ALERTA', 'RECORDATORIO', 'CONFIRMACION']
        if (!tiposValidos.includes(tipo)) {
            return NextResponse.json(
                { success: false, error: 'Tipo de notificación inválido' },
                { status: 400 }
            )
        }

        // Verificar que el usuario existe
        const usuario = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!usuario) {
            return NextResponse.json(
                { success: false, error: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        // Crear la notificación
        const nuevaNotificacion = await prisma.notification.create({
            data: {
                userId,
                titulo,
                mensaje,
                tipo,
                enlace: enlace || null,
                leido: false
            }
        })

        return NextResponse.json({
            success: true,
            data: nuevaNotificacion,
            message: 'Notificación creada exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al crear notificación:', error)
        return NextResponse.json(
            { success: false, error: 'Error al crear la notificación' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar todas las notificaciones leídas de un usuario
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId es requerido' },
                { status: 400 }
            )
        }

        await prisma.notification.deleteMany({
            where: {
                userId,
                leido: true
            }
        })

        return NextResponse.json({
            success: true,
            message: 'Notificaciones leídas eliminadas exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar notificaciones:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar las notificaciones' },
            { status: 500 }
        )
    }
}
