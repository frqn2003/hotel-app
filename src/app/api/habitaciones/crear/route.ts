import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// CREAR UNA NUEVA HABITACIÓN (para panel de administrador)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { numero, tipo, precio, capacidad, descripcion, comodidades, imagen, lat, lng } = body;

        // Validaciones
        if (!numero || !tipo || !precio || !capacidad) {
            return NextResponse.json(
                { success: false, error: "Todos los campos obligatorios son requeridos" },
                { status: 400 }
            );
        }

        // Verificar que el número de habitación no exista
        const existente = await prisma.room.findUnique({
            where: { numero }
        });

        if (existente) {
            return NextResponse.json(
                { success: false, error: `Ya existe una habitación con el número ${numero}` },
                { status: 409 }
            );
        }

        // Crear la habitación
        const nuevaHabitacion = await prisma.room.create({
            data: {
                numero,
                tipo,
                precio,
                capacidad,
                estado: 'DISPONIBLE', // Por defecto
                descripcion: descripcion || null,
                comodidades: comodidades || [],
                imagen: imagen || null,
                lat: lat || null,
                lng: lng || null
            }
        });

        return NextResponse.json({
            success: true,
            mensaje: "Habitación creada exitosamente",
            data: nuevaHabitacion
        });

    } catch (error) {
        console.error('Error al crear habitación:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
