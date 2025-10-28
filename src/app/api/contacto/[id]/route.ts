import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener una consulta específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const consulta = await prisma.contact.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                },
                operador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        })

        if (!consulta) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: consulta
        })
    } catch (error) {
        console.error('Error al obtener consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener la consulta' },
            { status: 500 }
        )
    }
}

// PUT - Responder o actualizar consulta
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { respuesta, estado, operadorId } = body

        // Verificar que la consulta existe
        const consultaExistente = await prisma.contact.findUnique({
            where: { id }
        })

        if (!consultaExistente) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        // Actualizar la consulta
        const consultaActualizada = await prisma.contact.update({
            where: { id },
            data: {
                ...(respuesta && { respuesta }),
                ...(estado && { estado }),
                ...(operadorId && { operadorId })
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
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: consultaActualizada,
            message: 'Consulta actualizada exitosamente'
        })
    } catch (error) {
        console.error('Error al actualizar consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al actualizar la consulta' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar consulta
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Verificar que la consulta existe
        const consultaExistente = await prisma.contact.findUnique({
            where: { id }
        })

        if (!consultaExistente) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        await prisma.contact.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Consulta eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar la consulta' },
            { status: 500 }
        )
    }
}
