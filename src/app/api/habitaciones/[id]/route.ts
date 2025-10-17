import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ACTUALIZAR UNA HABITACIÓN
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);
        const body = await request.json();

        // Verificar que la habitación existe
        const habitacionExistente = await prisma.room.findUnique({
            where: { id }
        });

        if (!habitacionExistente) {
            return NextResponse.json(
                { success: false, error: "Habitación no encontrada" },
                { status: 404 }
            );
        }

        // Actualizar solo los campos enviados
        const habitacionActualizada = await prisma.room.update({
            where: { id },
            data: body
        });

        return NextResponse.json({
            success: true,
            mensaje: "Habitación actualizada exitosamente",
            data: habitacionActualizada
        });

    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}

// ELIMINAR UNA HABITACIÓN
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = Number(params.id);

        // Verificar que la habitación existe
        const habitacion = await prisma.room.findUnique({
            where: { id },
            include: {
                reservations: true
            }
        });

        if (!habitacion) {
            return NextResponse.json(
                { success: false, error: "Habitación no encontrada" },
                { status: 404 }
            );
        }

        // Verificar si tiene reservas activas
        const reservasActivas = habitacion.reservations.filter(
            r => r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA'
        );

        if (reservasActivas.length > 0) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "No se puede eliminar una habitación con reservas activas" 
                },
                { status: 400 }
            );
        }

        // Eliminar la habitación (las reservas se eliminan en cascada por el schema)
        await prisma.room.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            mensaje: "Habitación eliminada exitosamente"
        });

    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
