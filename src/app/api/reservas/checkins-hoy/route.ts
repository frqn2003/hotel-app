import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const fecha = searchParams.get('fecha')
        
        const hoy = fecha ? new Date(fecha) : new Date()
        hoy.setHours(0, 0, 0, 0)
        
        const manana = new Date(hoy)
        manana.setDate(manana.getDate() + 1)

        const checkinsHoy = await prisma.reservation.findMany({
            where: {
                fechaEntrada: {
                    gte: hoy,
                    lt: manana
                }
            },
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
                fechaEntrada: 'asc'
            }
        })

        return NextResponse.json({
            success: true,
            data: checkinsHoy
        })
    } catch (error) {
        console.error('Error al obtener check-ins de hoy:', error);
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        )
    }
}
