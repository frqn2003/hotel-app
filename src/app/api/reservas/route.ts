import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest){
    try{
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')
        const roomId = searchParams.get('roomId')
        const estado = searchParams.get('estado')
        const fechaDesde = searchParams.get('fechaDesde')
        const fechaHasta = searchParams.get('fechaHasta')

        console.log('📋 GET /api/reservas - Filtros:', { userId, roomId, estado, fechaDesde, fechaHasta })

        // Construir filtros dinámicamente
        const where: any = {}
        
        if (userId) where.userId = userId
        if (roomId) where.roomId = roomId
        if (estado) where.estado = estado
        
        if (fechaDesde || fechaHasta) {
            where.fechaEntrada = {}
            if (fechaDesde) where.fechaEntrada.gte = new Date(fechaDesde)
            if (fechaHasta) where.fechaEntrada.lte = new Date(fechaHasta)
        }

        console.log('🔍 Prisma query where:', JSON.stringify(where, null, 2))

        const reservas = await prisma.reservation.findMany({
            where,
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
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        console.log(`✅ Encontradas ${reservas.length} reservas`)

        return NextResponse.json({
            success: true,
            data: reservas,
            message: `${reservas.length} reserva(s) encontrada(s)`
        })
    }
    catch (error){
        console.error('❌ Error al obtener reservas:', error);
        console.error('Stack trace:', (error as Error).stack);
        return NextResponse.json(
            { 
                success: false, 
                error: (error as Error).message,
                details: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const { fechaEntrada, fechaSalida, huespedes, precioTotal, estado, pagado, notasEspeciales, userId, roomId } = body;
        
        // 1. Verificar que la habitación existe y está disponible
        const habitacion = await prisma.room.findUnique({
            where: { id: roomId }
        })

        if (!habitacion) {
            return NextResponse.json(
                { success: false, error: 'Habitación no encontrada' },
                { status: 404 }
            )
        }

        if (habitacion.estado === 'MANTENIMIENTO') {
            return NextResponse.json(
                { success: false, error: 'La habitación está en mantenimiento y no puede ser reservada' },
                { status: 400 }
            )
        }

        if (habitacion.estado === 'OCUPADA') {
            return NextResponse.json(
                { success: false, error: 'La habitación ya está ocupada' },
                { status: 400 }
            )
        }

        if (habitacion.estado === 'RESERVADA') {
            return NextResponse.json(
                { success: false, error: 'La habitación ya tiene una reserva activa' },
                { status: 400 }
            )
        }

        // 2. Crear la reserva
        const nuevaReserva = await prisma.reservation.create({
            data: {
                userId,
                roomId,
                fechaEntrada: new Date(fechaEntrada),
                fechaSalida: new Date(fechaSalida),
                huespedes,
                precioTotal,
                estado: 'PENDIENTE',
                pagado: false,
                notasEspeciales,
            },
            include: {
                user: true,
                room: true,
            }
        })

        // 3. Determinar el nuevo estado de la habitación según la fecha de entrada
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0) // Resetear horas para comparar solo fechas
        
        const entrada = new Date(fechaEntrada)
        entrada.setHours(0, 0, 0, 0)
        
        // Si la fecha de entrada es hoy o ya pasó → OCUPADA
        // Si la fecha de entrada es futura → RESERVADA
        const nuevoEstado = entrada <= hoy ? 'OCUPADA' : 'RESERVADA'

        // 4. Actualizar el estado de la habitación
        await prisma.room.update({
            where: { id: nuevaReserva.roomId },
            data: { estado: nuevoEstado }
        })

        return NextResponse.json({
            message: "Reserva creada exitosamente",
            success: true,
            data: {
                ...nuevaReserva,
                room: {
                    ...nuevaReserva.room,
                    estado: nuevoEstado
                }
            }
        })
    }
    catch (error){
        console.error('Error al crear reserva:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}