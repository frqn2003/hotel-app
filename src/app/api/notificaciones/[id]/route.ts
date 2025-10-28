import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener una notificación específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const notificacion = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notificacion) {
            return NextResponse.json(
                { success: false, error: 'Notificación no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: notificacion
        })
    } catch (error) {
        console.error('Error al obtener notificación:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener la notificación' },
            { status: 500 }
        )
    }
}

// PUT - Marcar notificación como leída
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { leido } = body

        // Verificar que la notificación existe
        const notificacionExistente = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notificacionExistente) {
            return NextResponse.json(
                { success: false, error: 'Notificación no encontrada' },
                { status: 404 }
            )
        }

        // Actualizar la notificación
        const notificacionActualizada = await prisma.notification.update({
            where: { id },
            data: {
                leido: leido !== undefined ? leido : true
            }
        })

        return NextResponse.json({
            success: true,
            data: notificacionActualizada,
            message: 'Notificación actualizada exitosamente'
        })
    } catch (error) {
        console.error('Error al actualizar notificación:', error)
        return NextResponse.json(
            { success: false, error: 'Error al actualizar la notificación' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar notificación
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Verificar que la notificación existe
        const notificacionExistente = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notificacionExistente) {
            return NextResponse.json(
                { success: false, error: 'Notificación no encontrada' },
                { status: 404 }
            )
        }

        await prisma.notification.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Notificación eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar notificación:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar la notificación' },
            { status: 500 }
        )
    }
}
