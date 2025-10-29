import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Marcar todas las notificaciones como leídas
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId } = body

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'userId es requerido' },
                { status: 400 }
            )
        }

        // Actualizar todas las notificaciones no leídas del usuario
        const resultado = await prisma.notification.updateMany({
            where: {
                userId,
                leido: false
            },
            data: {
                leido: true
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                actualizadas: resultado.count
            },
            message: `${resultado.count} notificación(es) marcada(s) como leída(s)`
        })
    } catch (error) {
        console.error('Error al marcar notificaciones:', error)
        return NextResponse.json(
            { success: false, error: 'Error al marcar las notificaciones como leídas' },
            { status: 500 }
        )
    }
}
