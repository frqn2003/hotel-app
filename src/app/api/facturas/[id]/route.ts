import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener una factura específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const factura = await prisma.invoice.findUnique({
            where: { id },
            include: {
                payment: {
                    include: {
                        reservation: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        nombre: true,
                                        email: true,
                                        telefono: true
                                    }
                                },
                                room: {
                                    select: {
                                        numero: true,
                                        tipo: true,
                                        precio: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!factura) {
            return NextResponse.json(
                { success: false, error: 'Factura no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: factura
        })
    } catch (error) {
        console.error('Error al obtener factura:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener la factura' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar factura
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Verificar que la factura existe
        const facturaExistente = await prisma.invoice.findUnique({
            where: { id }
        })

        if (!facturaExistente) {
            return NextResponse.json(
                { success: false, error: 'Factura no encontrada' },
                { status: 404 }
            )
        }

        // Eliminar la factura
        await prisma.invoice.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Factura eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar factura:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar la factura' },
            { status: 500 }
        )
    }
}
