'use client'

import { Users, Wifi, Tv, Wind, MapPin } from 'lucide-react'
import type { Habitacion } from '@/types/habitacion'
import Boton from '@/componentes/ui/Boton'
import { useRouter } from 'next/navigation'

interface HabitacionCardProps {
    habitacion: Habitacion;
    onReservar?: (habitacionId: string) => void;
    onVerDetalles?: (habitacion: Habitacion) => void;
    isSelected?: boolean;
}

export default function HabitacionCard({ habitacion, onReservar, onVerDetalles, isSelected = false}: HabitacionCardProps) {
    const router = useRouter()

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'DISPONIBLE': return 'bg-green-100 text-green-800 border-green-300'
            case 'OCUPADA': return 'bg-red-100 text-red-800 border-red-300'
            case 'MANTENIMIENTO': return 'bg-orange-100 text-orange-800 border-orange-300'
            case 'RESERVADA': return 'bg-blue-100 text-blue-800 border-blue-300'
            default: return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    const getIconoComodidad = (comodidad: string) => {
        const lower = comodidad.toLowerCase()
        if (lower.includes('wifi')) return <Wifi className='h-4 w-4' />
        if (lower.includes('tv')) return <Tv className='h-4 w-4' />
        if (lower.includes('aire')) return <Wind className='h-4 w-4' />
        return <MapPin className='h-4 w-4' />
    }

    const handleReservar = () => {
        if (onReservar) {
            onReservar(habitacion.id.toString())
        } else {
            // Redirigir directamente a la página de personalizar reserva
            router.push(`/personalizar-reserva?habitacionId=${habitacion.id}`)
        }
    }

    const handleVerDetalles = () => {
        if (onVerDetalles) {
            onVerDetalles(habitacion)
        } else {
            router.push(`/habitaciones/detalles/${habitacion.id}`)
        }
    }

    return (
        <div key={`habitacion-${habitacion.id}`}>
            <div className={`
                bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 h-full flex flex-col justify-items-start
                ${isSelected ? 'ring-4 ring-blue-500' : ''}
            `}>
                {/* Imagen */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={habitacion.imagen || habitacion.imagenes?.[0] || '/images/room-default.jpg'}
                        alt={`Habitación ${habitacion.numero}`}
                        className="w-full h-full object-cover"
                    />
                    <div className={`
                        absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border-2
                        ${getEstadoColor(habitacion.estado)}
                    `}>
                        {habitacion.estado}
                    </div>
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-bold">
                        ${habitacion.precio}/noche
                    </div>
                </div>

                {/* Contenido */}
                <div className="p-5">
                    {/* Tipo */}
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{habitacion.tipo}</h3>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Users className='h-5 w-5' />
                            <span className="text-sm font-medium">{habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'}</span>
                        </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {habitacion.descripcion}
                    </p>

                    {/* Comodidades */}
                    {habitacion.comodidades && habitacion.comodidades.length > 0 && (() => {
                        let comodidadesArray: string[] = []
                        
                        if (Array.isArray(habitacion.comodidades)) {
                            if (habitacion.comodidades.length === 1 && typeof habitacion.comodidades[0] === 'string' && habitacion.comodidades[0].includes("'")) {
                                comodidadesArray = habitacion.comodidades[0]
                                    .split("', '")
                                    .map(c => c.replace(/^'|'$/g, '').trim())
                            } else {
                                comodidadesArray = habitacion.comodidades
                            }
                        } else if (typeof habitacion.comodidades === 'string') {
                            comodidadesArray = habitacion.comodidades.split(',').map(c => c.trim())
                        }
                        
                        return (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {comodidadesArray.slice(0, 4).map((comodidad, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                                    >
                                        {getIconoComodidad(comodidad)}
                                        <span>{comodidad}</span>
                                    </div>
                                ))}
                                {comodidadesArray.length > 4 && (
                                    <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                        +{comodidadesArray.length - 4} más
                                    </div>
                                )}
                            </div>
                        )
                    })()}

                    {/* Botones */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <Boton 
                                texto="Ver más" 
                                onClick={handleVerDetalles}
                            />
                            {habitacion.estado === 'DISPONIBLE' && (
                                <Boton 
                                    texto="Reservar" 
                                    onClick={handleReservar}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}