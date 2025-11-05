import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// GET: Obtener un operador específico
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const operador = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true,
        _count: {
          select: {
            contactsAsOperador: true
          }
        }
      }
    })

    if (!operador || operador.rol !== "OPERADOR") {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "Operador no encontrado" },
        { status: 404 }
      )
    }

    await prisma.$disconnect()
    return NextResponse.json({
      ...operador,
      consultasRespondidas: operador._count.contactsAsOperador
    })
  } catch (error) {
    console.error("Error fetching operador:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al obtener operador" },
      { status: 500 }
    )
  }
}

// PUT: Actualizar operador
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { nombre, email, telefono, password } = body

    const operador = await prisma.user.findUnique({
      where: { id }
    })

    if (!operador || operador.rol !== "OPERADOR") {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "Operador no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si el nuevo email ya existe (si cambió)
    if (email && email !== operador.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })
      if (existingUser) {
        await prisma.$disconnect()
        return NextResponse.json(
          { error: "El email ya está registrado" },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      nombre: nombre || operador.nombre,
      email: email || operador.email,
      telefono: telefono || operador.telefono
    }

    // Si se proporciona contraseña, hashearla
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const operadorActualizado = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true,
        createdAt: true
      }
    })

    await prisma.$disconnect()
    return NextResponse.json(operadorActualizado)
  } catch (error) {
    console.error("Error updating operador:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al actualizar operador" },
      { status: 500 }
    )
  }
}

// DELETE: Eliminar operador
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const operador = await prisma.user.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            contactsAsOperador: true,
            reservations: true
          }
        }
      }
    })

    if (!operador || operador.rol !== "OPERADOR") {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "Operador no encontrado" },
        { status: 404 }
      )
    }

    // Verificar si tiene reservas o consultas activas
    if (operador._count.reservations > 0 || operador._count.contactsAsOperador > 0) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "No se puede eliminar un operador con reservas o consultas asociadas" },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    await prisma.$disconnect()
    return NextResponse.json({ message: "Operador eliminado correctamente" })
  } catch (error) {
    console.error("Error deleting operador:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al eliminar operador" },
      { status: 500 }
    )
  }
}
