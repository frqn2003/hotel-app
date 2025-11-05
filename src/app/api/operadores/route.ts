import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server"

const prisma = new PrismaClient()

// GET: Obtener todos los operadores
export async function GET() {
  try {
    const operadores = await prisma.user.findMany({
      where: {
        rol: "OPERADOR"
      },
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
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    const operadoresFormateados = operadores.map(op => ({
      id: op.id,
      nombre: op.nombre,
      email: op.email,
      telefono: op.telefono,
      rol: op.rol,
      estado: "activo", // Puedes agregar un campo de estado en el modelo si lo necesitas
      createdAt: op.createdAt.toISOString(),
      consultasRespondidas: op._count.contactsAsOperador
    }))

    await prisma.$disconnect()
    return NextResponse.json(operadoresFormateados)
  } catch (error) {
    console.error("Error fetching operadores:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al obtener operadores" },
      { status: 500 }
    )
  }
}

// POST: Crear nuevo operador
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { nombre, email, telefono, password } = body

    if (!nombre || !email || !password) {
      await prisma.$disconnect()
      return NextResponse.json(
        { error: "Nombre, email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
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

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    const operador = await prisma.user.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        password: hashedPassword,
        rol: "OPERADOR"
      },
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
    return NextResponse.json(operador, { status: 201 })
  } catch (error) {
    console.error("Error creating operador:", error)
    await prisma.$disconnect()
    return NextResponse.json(
      { error: "Error al crear operador" },
      { status: 500 }
    )
  }
}
