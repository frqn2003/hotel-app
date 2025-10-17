import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// OBTENER TODAS LAS RESERVAS
export async function GET() {
    try {
        const reservas = await prisma.reservation.findMany({
            include: {
                user: true,  // Incluye datos del usuario
                room: true   // Incluye datos de la habitación
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: reservas
        });
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

// CREAR UNA NUEVA RESERVA
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, roomId, fechaEntrada, fechaSalida, huespedes, precioTotal, notasEspeciales } = body;

        // 1. VALIDACIONES
        if (!userId || !roomId || !fechaEntrada || !fechaSalida || !huespedes || !precioTotal) {
            return NextResponse.json(
                { success: false, error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        // 2. VERIFICAR QUE LA HABITACIÓN EXISTE Y ESTÁ DISPONIBLE
        const habitacion = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!habitacion) {
            return NextResponse.json(
                { success: false, error: "La habitación no existe" },
                { status: 404 }
            );
        }

        if (habitacion.estado !== 'DISPONIBLE') {
            return NextResponse.json(
                { success: false, error: "La habitación no está disponible" },
                { status: 400 }
            );
        }

        // 3. CREAR LA RESERVA EN LA BASE DE DATOS
        const nuevaReserva = await prisma.reservation.create({
            data: {
                userId,
                roomId,
                fechaEntrada: new Date(fechaEntrada),
                fechaSalida: new Date(fechaSalida),
                huespedes,
                precioTotal,
                notasEspeciales,
                estado: 'PENDIENTE',
                pagado: false
            },
            include: {
                user: true,
                room: true
            }
        });

        // 4. ACTUALIZAR EL ESTADO DE LA HABITACIÓN
        await prisma.room.update({
            where: { id: roomId },
            data: { estado: 'OCUPADA' }
        });

        return NextResponse.json({
            mensaje: "Reserva creada exitosamente",
            success: true,
            data: nuevaReserva
        });

    } catch (error) {
        console.error('Error al crear reserva:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
