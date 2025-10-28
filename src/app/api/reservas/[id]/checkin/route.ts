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

    // Verificar que esté en estado CONFIRMADA
    if (reserva.estado !== 'CONFIRMADA') {
      return NextResponse.json(
        { success: false, error: `No se puede hacer check-in. Estado actual: ${reserva.estado}` },
        { status: 400 }
      )
    }

    // Actualizar reserva a CHECKIN
    const reservaActualizada = await prisma.reservation.update({
      where: { id },
      data: { estado: 'CHECKIN' },
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

    // Actualizar habitación a OCUPADA
    await prisma.room.update({
      where: { id: reserva.roomId },
      data: { estado: 'OCUPADA' }
    })

    // Registrar actividad
    await prisma.activity.create({
      data: {
        tipo: 'CHECKIN',
        descripcion: `Check-in realizado para ${reserva.user.nombre} en habitación ${reserva.room.numero}`,
        userId: reserva.userId,
        reservationId: reserva.id,
        roomId: reserva.roomId
      }
    })

    console.log(`✅ Check-in completado: Reserva ${id} - Habitación ${reserva.room.numero} ahora OCUPADA`)

    return NextResponse.json({
      success: true,
      data: reservaActualizada,
      message: 'Check-in realizado exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al hacer check-in:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
