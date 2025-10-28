import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Obtener la reserva
    const reserva = await prisma.reservation.findUnique({
      where: { id },
      include: { room: true, user: true }
    })

    if (!reserva) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que esté en estado CHECKIN
    if (reserva.estado !== 'CHECKIN') {
      return NextResponse.json(
        { success: false, error: `No se puede hacer check-out. Estado actual: ${reserva.estado}` },
        { status: 400 }
      )
    }

    // Actualizar reserva a CHECKOUT
    const reservaActualizada = await prisma.reservation.update({
      where: { id },
      data: { estado: 'CHECKOUT' },
      include: {
        room: true,
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        }
      }
    })

    // Actualizar habitación a DISPONIBLE
    await prisma.room.update({
      where: { id: reserva.roomId },
      data: { estado: 'DISPONIBLE' }
    })

    // Registrar actividad
    await prisma.activity.create({
      data: {
        tipo: 'CHECKOUT',
        descripcion: `Check-out realizado para ${reserva.user.nombre} de habitación ${reserva.room.numero}`,
        userId: reserva.userId,
        reservationId: reserva.id,
        roomId: reserva.roomId
      }
    })

    console.log(`✅ Check-out completado: Reserva ${id} - Habitación ${reserva.room.numero} ahora DISPONIBLE`)

    return NextResponse.json({
      success: true,
      data: reservaActualizada,
      message: 'Check-out realizado exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al hacer check-out:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
