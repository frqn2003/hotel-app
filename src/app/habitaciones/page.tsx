'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import HabitacionCard from '@/componentes/Habitaciones/HabitacionCard'
import { Filter, Grid, Map, X, Search, Loader2 } from 'lucide-react'
import type { Habitacion } from '@/types/habitacion'

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapaHabitaciones = dynamic(
    () => import('@/componentes/Habitaciones/MapaHabitaciones'),
    { ssr: false, loading: () => <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div> }
)

export default function Habitaciones() {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([])
    const [habitacionesFiltradas, setHabitacionesFiltradas] = useState<Habitacion[]>([])
    const [loading, setLoading] = useState(true)
    const [vistaActual, setVistaActual] = useState<'lista' | 'mapa'>('lista')
    const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<number | null>(null)
    
    // Estados de filtros
    const [filtros, setFiltros] = useState({
        tipo: 'todos',
        estado: 'todos',
        precioMax: 2500000,
        busqueda: ''
    })
    const [mostrarFiltros, setMostrarFiltros] = useState(false)

    // Cargar habitaciones al montar el componente
    useEffect(() => {
        cargarHabitaciones()
    }, [])

    // Aplicar filtros cuando cambian
    useEffect(() => {
        aplicarFiltros()
    }, [filtros, habitaciones])

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

    const aplicarFiltros = () => {
        let resultado = [...habitaciones]

        if (filtros.tipo !== 'todos') {
            resultado = resultado.filter(h => h.tipo === filtros.tipo)
        }

        if (filtros.estado !== 'todos') {
            resultado = resultado.filter(h => h.estado === filtros.estado)
        }



        resultado = resultado.filter(h => h.precio <= filtros.precioMax)

        if (filtros.busqueda) {
            const busqueda = filtros.busqueda.toLowerCase()
            resultado = resultado.filter(h => 
                h.numero.toString().includes(busqueda) ||
                h.tipo.toLowerCase().includes(busqueda) ||
                h.descripcion?.toLowerCase().includes(busqueda)
            )
        }

        setHabitacionesFiltradas(resultado)
    }

    const limpiarFiltros = () => {
        setFiltros({
            tipo: 'todos',
            estado: 'todos',
            precioMax: 2500000,
            busqueda: ''
        })
    }

    const handleHabitacionClick = (habitacion: Habitacion) => {
        setHabitacionSeleccionada(habitacion.id)
        if (vistaActual === 'lista') {
            const element = document.getElementById(`habitacion-${habitacion.id}`)
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    const handleReservar = (habitacion: Habitacion) => {
        window.location.href = `/reserva?habitacion=${habitacion.id}`
    }

    const tiposUnicos = ['todos', ...new Set(habitaciones.map(h => h.tipo))]

    return (
        <>
            
            <Navbar 
                onSubPage={true}
            />
            <main className="min-h-screen bg-gray-50">
                {/* Header */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                    <div className="contenedor">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Habitaciones</h1>
                        <p className="text-lg text-blue-100">Explora y encuentra la habitación perfecta para tu estadía</p>
                    </div>
                </section>

                {/* Barra de herramientas */}
                <section className="sticky top-16 bg-white pt-4 backdrop-blur-2xl border-b border-gray-200 z-40 shadow-sm">
                    <div className="contenedor py-4">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            {/* Búsqueda */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por número, tipo..."
                                    value={filtros.busqueda}
                                    onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Botones */}
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Filter className="h-4 w-4" />
                                    Filtros
                                </button>
                                
                                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setVistaActual('lista')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                            vistaActual === 'lista' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        <Grid className="h-4 w-4" />
                                        Lista
                                    </button>
                                    <button
                                        onClick={() => setVistaActual('mapa')}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                            vistaActual === 'mapa' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        <Map className="h-4 w-4" />
                                        Mapa
                                    </button>
                                </div>

                                <div className="text-sm text-gray-600 flex items-center">
                                    <span className="font-semibold">{habitacionesFiltradas.length}</span>
                                    <span className="ml-1">habitaciones</span>
                                </div>
                            </div>
                        </div>

                        {/* Panel de Filtros */}
                        {mostrarFiltros && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-900">Filtros</h3>
                                    <button
                                        onClick={limpiarFiltros}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Tipo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                                        <select
                                            value={filtros.tipo}
                                            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            {tiposUnicos.map(tipo => (
                                                <option key={tipo} value={tipo}>
                                                    {tipo === 'todos' ? 'Todos los tipos' : tipo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                        <select
                                            value={filtros.estado}
                                            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="todos">Todos los estados</option>
                                            <option value="DISPONIBLE">Disponible</option>
                                            <option value="OCUPADA">Ocupada</option>
                                            <option value="MANTENIMIENTO">Mantenimiento</option>
                                            <option value="RESERVADA">Reservada</option>
                                        </select>
                                    </div>

                                    {/* Precio */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Precio máximo: ${filtros.precioMax}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="2500000"
                                            step="1000"
                                            value={filtros.precioMax}
                                            onChange={(e) => setFiltros({ ...filtros, precioMax: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Contenido */}
                <section className="contenedor py-8">
                    {loading ? (
                        <div className="flex items-center justify-center h-96">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <>
                            {vistaActual === 'lista' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {habitacionesFiltradas.map(habitacion => (
                                        <div key={habitacion.id} id={`habitacion-${habitacion.id}`}>
                                            <HabitacionCard
                                                habitacion={habitacion}
                                                onReservar={handleReservar}
                                                isSelected={habitacionSeleccionada === habitacion.id}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
                                    <MapaHabitaciones
                                        habitaciones={habitacionesFiltradas}
                                        onHabitacionClick={handleHabitacionClick}
                                        habitacionSeleccionada={habitacionSeleccionada}
                                    />
                                </div>
                            )}

                            {habitacionesFiltradas.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <Search className="h-16 w-16 mx-auto" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No se encontraron habitaciones
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Intenta ajustar los filtros o realiza una nueva búsqueda
                                    </p>
                                    <button
                                        onClick={limpiarFiltros}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        Limpiar filtros
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    )
}