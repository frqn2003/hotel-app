import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las consultas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado')
    const userId = searchParams.get('userId')

    const where: any = {}

    if (estado) {
      where.estado = estado
    }

    if (userId) {
      where.userId = userId
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
    console.error('❌ Error al obtener consultas:', error)
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

    // Crear la consulta
    const nuevaConsulta = await prisma.contact.create({
      data: {
        nombre,
        email,
        telefono,
        asunto,
        mensaje,
        userId,
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

    console.log(`✅ Nueva consulta creada: ${nuevaConsulta.id}`)

    return NextResponse.json({
      success: true,
      data: nuevaConsulta,
      message: 'Consulta enviada exitosamente'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error al crear consulta:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar la consulta' },
      { status: 500 }
    )
  }
}
