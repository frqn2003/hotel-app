'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { Habitacion } from '@/types/habitacion'

interface MapaHabitacionesProps {
    habitaciones: Habitacion[];
    onHabitacionClick?: (habitacion: Habitacion) => void;
    habitacionSeleccionada?: string | null;
}

export default function MapaHabitaciones({ 
    habitaciones, 
    onHabitacionClick,
    habitacionSeleccionada 
}: MapaHabitacionesProps) {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<L.Map | null>(null)
    const markersRef = useRef<L.Marker[]>([])

    useEffect(() => {
        if (!mapRef.current) return

        // Limpiar mapa anterior si existe
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
        }

        // Crear mapa usando coordenadas simples (plano del hotel)
        const map = L.map(mapRef.current, {
            crs: L.CRS.Simple,
            minZoom: -1,
            maxZoom: 2,
            zoomControl: true,
            attributionControl: false
        })

        mapInstanceRef.current = map

        // Definir bounds del plano del hotel (100x100 unidades)
        const bounds: L.LatLngBoundsExpression = [[0, 0], [100, 100]]
        
        // Agregar imagen de fondo (opcional - puedes usar un color)
        L.imageOverlay('/hotel-plano.webp', bounds).addTo(map).setOpacity(0.3)
        
        // O simplemente un fondo con color
        map.fitBounds(bounds)
        map.setView([50, 50], 0)

        // Limpiar marcadores anteriores
        markersRef.current.forEach(marker => marker.remove())
        markersRef.current = []

        // Colores según estado
        const getColor = (estado: string) => {
            switch (estado) {
                case 'DISPONIBLE': return '#10b981' // verde
                case 'OCUPADA': return '#ef4444' // rojo
                case 'MANTENIMIENTO': return '#f59e0b' // naranja
                case 'RESERVADA': return '#3b82f6' // azul
                default: return '#6b7280' // gris
            }
        }

        // Agregar marcadores para cada habitación
        habitaciones.forEach(habitacion => {
            const { x, y } = habitacion.coordenadas
            const color = getColor(habitacion.estado)
            const isSelected = habitacionSeleccionada === habitacion.id

            // Crear ícono personalizado
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `
                    <div style="
                        background-color: ${color};
                        width: 40px;
                        height: 40px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-weight: bold;
                        font-size: 12px;
                        border: ${isSelected ? '3px solid #1f2937' : '2px solid white'};
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        cursor: pointer;
                        transition: transform 0.2s;
                    " class="marker-content">
                        ${habitacion.numero}
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            })

            const marker = L.marker([y, x], { icon })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width: 200px;">
                        <h3 style="font-weight: bold; margin-bottom: 8px;">
                            Habitación ${habitacion.numero}
                        </h3>
                        <p style="margin: 4px 0;"><strong>Tipo:</strong> ${habitacion.tipo}</p>
                        <p style="margin: 4px 0;"><strong>Estado:</strong> ${habitacion.estado}</p>
                        <p style="margin: 4px 0;"><strong>Precio:</strong> $${habitacion.precio}/noche</p>
                    </div>
                `)

            // Evento click
            marker.on('click', () => {
                if (onHabitacionClick) {
                    onHabitacionClick(habitacion)
                }
            })

            markersRef.current.push(marker)
        })

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [habitaciones, habitacionSeleccionada, onHabitacionClick])

    return (
        <div className="relative w-full h-full">
            <div ref={mapRef} className="w-full h-full rounded-lg shadow-lg" />
            
            {/* Leyenda */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-[1000]">
                <h4 className="font-bold text-sm mb-2">Leyenda</h4>
                <div className="flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Ocupada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span>Mantenimiento</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Reservada</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
