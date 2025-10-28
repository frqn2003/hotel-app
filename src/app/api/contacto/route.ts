import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Obtener todas las consultas (con filtros opcionales)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const estado = searchParams.get('estado') // PENDIENTE, EN_PROCESO, RESPONDIDO, CERRADO
        const userId = searchParams.get('userId')
        const operadorId = searchParams.get('operadorId')

        const where: any = {}

        if (estado) {
            where.estado = estado
        }
        if (userId) {
            where.userId = userId
        }
        if (operadorId) {
            where.operadorId = operadorId
        }

        const consultas = await prisma.contact.findMany({
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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({
            success: true,
            data: consultas,
            total: consultas.length
        })
    } catch (error) {
        console.error('Error al obtener consultas:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener las consultas' },
            { status: 500 }
        )
    }
}

// POST - Crear nueva consulta
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { nombre, email, telefono, asunto, mensaje, userId } = body

        // Validaciones
        if (!nombre || !email || !asunto || !mensaje) {
            return NextResponse.json(
                { success: false, error: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Email inválido' },
                { status: 400 }
            )
        }

        const nuevaConsulta = await prisma.contact.create({
            data: {
                nombre,
                email,
                telefono,
                asunto,
                mensaje,
                userId: userId || null,
                estado: 'PENDIENTE'
            },
            include: {
                user: {
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
            data: nuevaConsulta,
            message: 'Consulta enviada exitosamente'
        }, { status: 201 })
    } catch (error) {
        console.error('Error al crear consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al enviar la consulta' },
            { status: 500 }
        )
    }
}
