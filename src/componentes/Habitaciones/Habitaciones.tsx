'use client'

import HabitacionCard from "@/componentes/Habitaciones/HabitacionCard"
import { useState } from "react"
import type { Habitacion } from '@/types/habitacion'
import { useRouter } from 'next/navigation'

export default function Habitaciones() {
    // Backend deshabilitado - Usando datos mock
    const habitaciones: Habitacion[] = [
        {
            id: '1',
            numero: 101,
            tipo: 'SIMPLE',
            precio: 50000,
            estado: 'DISPONIBLE',
            descripcion: 'Habitación simple con vista a la ciudad',
            capacidad: 1,
            imagen: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            comodidades: ['WiFi', 'TV', 'Aire Acondicionado'],
            lat: -34.9011,
            lng: -56.1645
        },
        {
            id: '2',
            numero: 102,
            tipo: 'DOBLE',
            precio: 80000,
            estado: 'DISPONIBLE',
            descripcion: 'Habitación doble con dos camas',
            capacidad: 2,
            imagen: 'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFiaXRhY2klQzMlQjNuJTIwZGUlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000',
            comodidades: ['WiFi', 'TV', 'Minibar'],
            lat: -34.9012,
            lng: -56.1646
        },
        {
            id: '3',
            numero: 201,
            tipo: 'SUITE',
            precio: 150000,
            estado: 'DISPONIBLE',
            descripcion: 'Suite de lujo con vista al mar',
            capacidad: 4,
            imagen: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aGFiaXRhY2klQzMlQjNuJTIwZGUlMjBob3RlbHxlbnwwfHwwfHx8MA%3D%3D&fm=jpg&q=60&w=3000',
            comodidades: ['WiFi', 'TV', 'Jacuzzi', 'Vista al mar'],
            lat: -34.9013,
            lng: -56.1647
        }
    ]
    const loading = false
    const error = null
    
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<Habitacion[]>([])
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null)
    const router = useRouter()
    
    const handleReservar = (habitacionId: string) => {
        const habitacion = habitaciones.find(h => h.id.toString() === habitacionId)
        if (habitacion) {
            window.location.href = `/personalizar-reserva?habitacion=${habitacion.numero}`
        }
    }

    const handleVerDetalles = (habitacion: Habitacion) => {
        router.push(`/habitaciones/detalles/${habitacion.id}`)
    }
    // Mostrar error si existe
    if (error) {
        return (
            <section className="contenedor my-12">
                <div className="text-center text-red-600">
                    <p>Error al cargar habitaciones: {error}</p>
                </div>
            </section>
        )
    }

    return (
        <section className="contenedor my-12 space-y-7 gap-5" id="habitaciones">
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">Nuestras Habitaciones</h2>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl text-center">
                    Espacios diseñados para tu comodidad, desde opciones prácticas hasta suites de lujo
                </p>
            </div>
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Cargando habitaciones...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(habitacionesFiltradas.length > 0 ? habitacionesFiltradas : habitaciones).map(habitacion => (
                    <div key={habitacion.id} id={`habitacion-${habitacion.numero}`}>
                        <HabitacionCard
                            habitacion={habitacion}
                            onReservar={handleReservar}
                            onVerDetalles={handleVerDetalles}
                            isSelected={habitacionSeleccionada === habitacion.numero}
                        />
                    </div>
                    ))}
                </div>
            )}
        </section >
    )
}