import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nombre, email, telefono } = body

    // Actualizar usuario
    const usuario = await prisma.user.update({
      where: { id },
      data: {
        nombre,
        email,
        telefono
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        telefono: true,
        rol: true
      }
    })

    console.log(`✅ Usuario actualizado: ${id}`)

    return NextResponse.json({
      success: true,
      data: usuario,
      message: 'Perfil actualizado exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
