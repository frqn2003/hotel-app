import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const reserva = await prisma.reservation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        room: {
          select: {
            id: true,
            numero: true,
            tipo: true
          }
        }
      }
    })

    if (!reserva) {
      return NextResponse.json(
        { success: false, error: 'Reserva no encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: reserva
    })
  } catch (error) {
    console.error('❌ Error al obtener reserva:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const reserva = await prisma.reservation.update({
      where: { id },
      data: body,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true
          }
        },
        room: {
          select: {
            id: true,
            numero: true,
            tipo: true
          }
        }
      }
    })

    // Actualizar estado de habitación según el estado de la reserva
    if (body.estado) {
      let estadoHabitacion: string | null = null
      
      switch (body.estado) {
        case 'CONFIRMADA':
          estadoHabitacion = 'RESERVADA'
          break
        case 'CHECKIN':
          estadoHabitacion = 'OCUPADA'
          break
        case 'CHECKOUT':
        case 'CANCELADA':
          estadoHabitacion = 'DISPONIBLE'
          break
      }

      if (estadoHabitacion) {
        await prisma.room.update({
          where: { id: reserva.roomId },
          data: { estado: estadoHabitacion as any }
        })
        
        console.log(`🏨 Habitación ${reserva.room?.numero} actualizada a: ${estadoHabitacion}`)
      }
    }

    return NextResponse.json({
      success: true,
      data: reserva,
      message: 'Reserva actualizada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al actualizar reserva:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Obtener reserva antes de eliminar para liberar la habitación
    const reserva = await prisma.reservation.findUnique({
      where: { id },
      select: { roomId: true, estado: true }
    })

    if (reserva) {
      // Liberar habitación si la reserva estaba confirmada u ocupada
      if (['CONFIRMADA', 'CHECKIN', 'PENDIENTE'].includes(reserva.estado)) {
        await prisma.room.update({
          where: { id: reserva.roomId },
          data: { estado: 'DISPONIBLE' }
        })
        console.log(`🏨 Habitación liberada al eliminar reserva ${id}`)
      }
    }

    await prisma.reservation.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Reserva eliminada exitosamente'
    })
  } catch (error) {
    console.error('❌ Error al eliminar reserva:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    )
  }
}
