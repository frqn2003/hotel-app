import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FilePathHabitaciones = path.join(process.cwd(), "data", "habitaciones.json");

export interface Habitacion {
    id: string;
    numero: number;
    tipo: string;
    estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO' | 'RESERVADA';
    precio: number;
    capacidad: number;
    descripcion: string;
    comodidades: string[];
    coordenadas: { x: number; y: number };
    imagenes: string[];
}

export async function GET(request: NextRequest) {
    try {
        // Leer parámetros de búsqueda
        const { searchParams } = new URL(request.url);
        const tipo = searchParams.get('tipo');
        const estado = searchParams.get('estado');

        // Leer habitaciones del archivo JSON
        let habitaciones: Habitacion[] = [];
        try {
            const habitacionesLeidas = JSON.parse(fs.readFileSync(FilePathHabitaciones, "utf-8"));
            habitaciones = habitacionesLeidas;
        } catch (error) {
            return NextResponse.json(
                { mensaje: "No hay habitaciones registradas", success: false },
                { status: 404 }
            );
        }

        // Filtrar habitaciones según parámetros
        let habitacionesFiltradas = habitaciones;

        if (tipo && tipo !== 'todos') {
            habitacionesFiltradas = habitacionesFiltradas.filter(h => h.tipo === tipo);
        }

        if (estado && estado !== 'todos') {
            habitacionesFiltradas = habitacionesFiltradas.filter(h => h.estado === estado);
        }

        return NextResponse.json(
            {
                mensaje: "Habitaciones obtenidas exitosamente",
                success: true,
                data: habitacionesFiltradas,
                total: habitacionesFiltradas.length
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error en GET /api/habitaciones:', error);
        return NextResponse.json(
            {
                mensaje: "Error interno del servidor",
                success: false,
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}

// Obtener una habitación específica por ID
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

        let habitaciones: Habitacion[] = [];
        try {
            const habitacionesLeidas = JSON.parse(fs.readFileSync(FilePathHabitaciones, "utf-8"));
            habitaciones = habitacionesLeidas;
        } catch (error) {
            return NextResponse.json(
                { mensaje: "No hay habitaciones registradas", success: false },
                { status: 404 }
            );
        }

        const habitacion = habitaciones.find((h) => h.id === id);

        if (!habitacion) {
            return NextResponse.json(
                { mensaje: "Habitación no encontrada", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                mensaje: "Habitación obtenida exitosamente",
                success: true,
                data: habitacion
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error en POST /api/habitaciones:', error);
        return NextResponse.json(
            {
                mensaje: "Error interno del servidor",
                success: false,
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}
