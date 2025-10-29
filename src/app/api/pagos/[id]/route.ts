import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener un pago específico
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const pago = await prisma.payment.findUnique({
            where: { id },
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
                },
                invoice: true
            }
        })

        if (!pago) {
            return NextResponse.json(
                { success: false, error: 'Pago no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: pago
        })
    } catch (error) {
        console.error('Error al obtener pago:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener el pago' },
            { status: 500 }
        )
    }
}

// PUT - Actualizar estado del pago
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { estado } = body

        // Verificar que el pago existe
        const pagoExistente = await prisma.payment.findUnique({
            where: { id }
        })

        if (!pagoExistente) {
            return NextResponse.json(
                { success: false, error: 'Pago no encontrado' },
                { status: 404 }
            )
        }

        // Validar estado
        const estadosValidos = ['PENDIENTE', 'PROCESANDO', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO']
        if (estado && !estadosValidos.includes(estado)) {
            return NextResponse.json(
                { success: false, error: 'Estado de pago inválido' },
                { status: 400 }
            )
        }

        // Actualizar el pago
        const pagoActualizado = await prisma.payment.update({
            where: { id },
            data: {
                estado,
                ...(estado === 'COMPLETADO' && !pagoExistente.fechaPago && { fechaPago: new Date() })
            },
            include: {
                reservation: true,
                invoice: true
            }
        })

        return NextResponse.json({
            success: true,
            data: pagoActualizado,
            message: 'Pago actualizado exitosamente'
        })
    } catch (error) {
        console.error('Error al actualizar pago:', error)
        return NextResponse.json(
            { success: false, error: 'Error al actualizar el pago' },
            { status: 500 }
        )
    }
}

// DELETE - Eliminar pago (solo si está en estado PENDIENTE o FALLIDO)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Verificar que el pago existe
        const pagoExistente = await prisma.payment.findUnique({
            where: { id },
            include: {
                invoice: true
            }
        })

        if (!pagoExistente) {
            return NextResponse.json(
                { success: false, error: 'Pago no encontrado' },
                { status: 404 }
            )
        }

        // Solo permitir eliminar pagos pendientes o fallidos
        if (pagoExistente.estado !== 'PENDIENTE' && pagoExistente.estado !== 'FALLIDO') {
            return NextResponse.json(
                { success: false, error: 'No se puede eliminar un pago completado o en proceso' },
                { status: 400 }
            )
        }

        // Eliminar factura asociada si existe
        if (pagoExistente.invoice) {
            await prisma.invoice.delete({
                where: { paymentId: id }
            })
        }

        // Eliminar el pago
        await prisma.payment.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Pago eliminado exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar pago:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar el pago' },
            { status: 500 }
        )
    }
}
