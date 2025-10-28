'use client'

import HabitacionCard from "@/componentes/Habitaciones/HabitacionCard"
import { useState, useEffect } from "react"
import type { Habitacion } from '@/types/habitacion'

export default function Habitaciones() {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<Habitacion[]>([])
    const [loading, setLoading] = useState(true)
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null)

    // Cargar habitaciones al montar el componente
    useEffect(() => {
        cargarHabitaciones()
    }, [])
    const cargarHabitaciones = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/habitaciones')
            const data = await response.json()

            if (data.success) {
                setHabitaciones(data.data)
                setHabitacionesFiltradas(data.data)
            }
        } catch (error) {
            console.error('Error al cargar habitaciones:', error)
        } finally {
            setLoading(false)
        }
    }
    const handleReservar = (habitacion: Habitacion) => {
        window.location.href = `/reserva?habitacion=${habitacion.id}`
    }
    return (
        <section className="contenedor my-12 space-y-7 gap-5" id="habitaciones">
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">Nuestras Habitaciones</h2>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl text-center">
                    Espacios diseñados para tu comodidad, desde opciones prácticas hasta suites de lujo
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {habitacionesFiltradas.map(habitacion => (
                    <div key={habitacion.id} id={`habitacion-${habitacion.id}`}>
                        <HabitacionCard
                            habitacion={habitacion}
                            onReservar={handleReservar}
                            onVerDetalles={() => setHabitacionSeleccionada(habitacion.id)}
                            isSelected={habitacionSeleccionada === habitacion.id}
                        />
                    </div>
                ))}
            </div>
        </section >
    )
}