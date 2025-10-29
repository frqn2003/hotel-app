'use client'

import HabitacionCard from "@/componentes/Habitaciones/HabitacionCard"
import { useState } from "react"
import { useHabitaciones } from "@/hooks"
import type { Habitacion } from '@/types/habitacion'

export default function Habitaciones() {
    const { habitaciones, loading, error } = useHabitaciones()
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<Habitacion[]>([])
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null)
    const handleReservar = (habitacion: Habitacion) => {
        window.location.href = `/reserva?habitacion=${habitacion.numero}`
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
                            onVerDetalles={() => setHabitacionSeleccionada(habitacion.numero)}
                            isSelected={habitacionSeleccionada === habitacion.numero}
                        />
                    </div>
                    ))}
                </div>
            )}
        </section >
    )
}