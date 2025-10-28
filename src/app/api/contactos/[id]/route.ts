import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener una consulta específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const consulta = await prisma.contact.findUnique({
      where: { id },
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
    console.error('❌ Error al obtener consulta:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener la consulta' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar consulta (responder)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { respuesta, operadorId, estado } = body

    // Validar que existe la consulta
    const consulta = await prisma.contact.findUnique({
      where: { id }
    })

    if (!consulta) {
      return NextResponse.json(
        { success: false, error: 'Consulta no encontrada' },
        { status: 404 }
      )
    }

    // Actualizar la consulta
    const consultaActualizada = await prisma.contact.update({
      where: { id },
      data: {
        respuesta,
        operadorId,
        estado: estado || (respuesta ? 'RESPONDIDO' : consulta.estado)
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

    console.log(`✅ Consulta actualizada: ${id} - Estado: ${consultaActualizada.estado}`)

    return NextResponse.json({
      success: true,
      data: consultaActualizada,
      message: 'Consulta actualizada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al actualizar consulta:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar la consulta' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar consulta
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.contact.delete({
      where: { id }
    })

    console.log(`✅ Consulta eliminada: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Consulta eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al eliminar consulta:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar la consulta' },
      { status: 500 }
    )
  }
}
