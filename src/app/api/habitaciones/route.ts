import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// OBTENER TODAS LAS HABITACIONES (con filtros opcionales)
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');
        const estado = searchParams.get('estado');

        // Construir objeto where dinámicamente
        const where: any = {}
        
        if (tipo && tipo !== 'todos') {
            where.tipo = tipo
        }
        
        if (estado && estado !== 'todos') {
            where.estado = estado
        }

        const habitaciones = await prisma.room.findMany({
            where,
            orderBy: {
                numero: 'asc'
            }
        })

        return NextResponse.json({
            success: true,
            data: habitaciones,
            total: habitaciones.length
        })

    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}

// BUSCAR UNA HABITACIÓN ESPECÍFICA POR ID (usado en página de reserva)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "ID de habitación requerido" },
                { status: 400 }
            );
        }

        // Convertir a número si viene como string
        const habitacionId = typeof id === 'string' ? parseInt(id) : id;

        const habitacion = await prisma.room.findUnique({
            where: { id: habitacionId }
        })

        if (!habitacion) {
            return NextResponse.json(
                { success: false, error: "Habitación no encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: habitacion
        })

    } catch (error) {
        console.error('Error al buscar habitación:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
