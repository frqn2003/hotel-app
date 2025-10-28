import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcryptjs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { passwordActual, passwordNueva } = body

    // Obtener usuario
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: { password: true }
    })

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar contraseña actual
    const isValid = await bcrypt.compare(passwordActual, usuario.password)
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Contraseña actual incorrecta' },
        { status: 400 }
      )
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(passwordNueva, 10)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })

    console.log(`✅ Contraseña actualizada para usuario: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al cambiar contraseña:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
