import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las facturas
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const paymentId = searchParams.get('paymentId')

        const where: any = {}

        if (paymentId) {
            where.paymentId = paymentId
        }

        const facturas = await prisma.invoice.findMany({
            where,
            include: {
                payment: {
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: facturas,
            total: facturas.length
        })
    } catch (error) {
        console.error('Error al obtener facturas:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener las facturas' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva factura
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { paymentId, subtotal, impuestos, detalles } = body

        // Validaciones
        if (!paymentId || subtotal === undefined || impuestos === undefined) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Validar que el pago existe y no tiene factura
        const pago = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                invoice: true
            }
        })

        if (!pago) {
            return NextResponse.json(
                { success: false, error: 'Pago no encontrado' },
                { status: 404 }
            )
        }

        if (pago.invoice) {
            return NextResponse.json(
                { success: false, error: 'Este pago ya tiene una factura asociada' },
                { status: 400 }
            )
        }

        // Calcular total
        const total = subtotal + impuestos

        // Generar número de factura único
        const year = new Date().getFullYear()
        const ultimaFactura = await prisma.invoice.findFirst({
            where: {
                numeroFactura: {
                    startsWith: `FAC-${year}-`
                }
            },
            orderBy: {
                numeroFactura: 'desc'
            }
        })

        let numeroSecuencial = 1
        if (ultimaFactura) {
            const ultimoNumero = parseInt(ultimaFactura.numeroFactura.split('-')[2])
            numeroSecuencial = ultimoNumero + 1
        }

        const numeroFactura = `FAC-${year}-${numeroSecuencial.toString().padStart(4, '0')}`

        // Crear la factura
        const nuevaFactura = await prisma.invoice.create({
            data: {
                paymentId,
                numeroFactura,
                subtotal,
                impuestos,
                total,
                detalles: detalles || []
            },
            include: {
                payment: {
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
                }
            }
        })

        return NextResponse.json({
            success: true,
            data: nuevaFactura,
            message: 'Factura generada exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al crear factura:', error)
        return NextResponse.json(
            { success: false, error: 'Error al generar la factura' },
            { status: 500 }
        )
    }
}
