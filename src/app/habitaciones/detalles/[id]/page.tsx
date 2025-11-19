'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
    ArrowLeft, 
    Users, 
    Wifi, 
    Tv, 
    Wind, 
    MapPin, 
    Star, 
    CheckCircle2, 
    Calendar,
    Car,
    Coffee,
    Shirt,
    Utensils,
    Eye,
    Bed,
    Bath,
    Ruler,
    Clock
} from 'lucide-react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import Boton from '@/componentes/ui/Boton'

interface Habitacion {
    id: string
    numero: number
    tipo: string
    precio: number
    imagen: string
    imagenes: string[]
    capacidad: number
    estado: string
    descripcion: string
    comodidades: string[]
    tamaño?: number
    camas?: string
    serviciosIncluidos?: string[]
}

export default function DetalleHabitacion() {
    const params = useParams()
    const router = useRouter()
    const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [imagenPrincipal, setImagenPrincipal] = useState('')
    const [galeriaAbierta, setGaleriaAbierta] = useState(false)
    const [imagenActiva, setImagenActiva] = useState(0)

    // Datos de ejemplo para características adicionales
    const caracteristicasAdicionales = {
        'SIMPLE': {
            tamaño: 25,
            camas: '1 Cama Queen Size',
            serviciosIncluidos: ['Desayuno continental', 'Limpieza diaria', 'Toallas y amenities']
        },
        'DOBLE': {
            tamaño: 35,
            camas: '2 Camas Full Size o 1 Cama King Size',
            serviciosIncluidos: ['Desayuno buffet', 'Limpieza diaria', 'Toallas y amenities', 'TV por cable']
        },
        'SUITE': {
            tamaño: 50,
            camas: '1 Cama King Size + área de estar',
            serviciosIncluidos: ['Desayuno buffet premium', 'Limpieza diaria', 'Amenities de lujo', 'TV Smart 4K', 'Minibar incluido']
        }
    }

    useEffect(() => {
        const habitacionId = params.id as string
        if (habitacionId) {
            cargarHabitacion(habitacionId)
        }
    }, [params.id])

    const cargarHabitacion = async (id: string) => {
        try {
            // Backend deshabilitado - Usando datos mock
            const habitacionesMock = [
                {
                    id: '1',
                    numero: 101,
                    tipo: 'SIMPLE',
                    precio: 50000,
                    capacidad: 1,
                    estado: 'DISPONIBLE',
                    descripcion: 'Habitación simple perfecta para viajeros solitarios. Cuenta con una cama queen size cómoda, escritorio de trabajo y baño privado con ducha.',
                    imagen: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop',
                    imagenes: [
                        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop',
                        'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
                        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
                    ],
                    comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Escritorio', 'Caja de Seguridad']
                },
                {
                    id: '2',
                    numero: 102,
                    tipo: 'DOBLE',
                    precio: 80000,
                    capacidad: 2,
                    estado: 'DISPONIBLE',
                    descripcion: 'Habitación doble espaciosa ideal para parejas o amigos. Dispone de dos camas full size o una king size, área de estar y baño completo.',
                    imagen: 'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=3000',
                    imagenes: [
                        'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=3000',
                        'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800',
                        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800'
                    ],
                    comodidades: ['WiFi', 'TV', 'Minibar', 'Cafetera', 'Balcón']
                },
                {
                    id: '3',
                    numero: 201,
                    tipo: 'SUITE',
                    precio: 150000,
                    capacidad: 4,
                    estado: 'DISPONIBLE',
                    descripcion: 'Suite de lujo con vista panorámica al mar. Incluye sala de estar separada, cama king size, jacuzzi privado y todas las comodidades premium.',
                    imagen: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=3000',
                    imagenes: [
                        'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=3000',
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
                        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'
                    ],
                    comodidades: ['WiFi', 'TV Smart 4K', 'Jacuzzi', 'Vista al mar', 'Minibar Premium', 'Room Service 24h']
                }
            ]
            
            const habitacionEncontrada = habitacionesMock.find(h => h.id === id)
            
            if (habitacionEncontrada) {
                const caracteristicas = caracteristicasAdicionales[habitacionEncontrada.tipo as keyof typeof caracteristicasAdicionales] || {}
                
                setHabitacion({
                    ...habitacionEncontrada,
                    ...caracteristicas
                })
                setImagenPrincipal(habitacionEncontrada.imagen || '/images/room-default.jpg')
            } else {
                setError('Habitación no encontrada')
            }
        } catch (error) {
            console.error('Error al cargar habitación:', error)
            setError('Error al cargar los datos de la habitación')
        } finally {
            setCargando(false)
        }
    }

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
        if (lower.includes('wifi')) return <Wifi className='h-5 w-5' />
        if (lower.includes('tv')) return <Tv className='h-5 w-5' />
        if (lower.includes('aire')) return <Wind className='h-5 w-5' />
        if (lower.includes('estacionamiento') || lower.includes('parking')) return <Car className='h-5 w-5' />
        if (lower.includes('desayuno')) return <Coffee className='h-5 w-5' />
        if (lower.includes('lavandería') || lower.includes('lavanderia')) return <Shirt className='h-5 w-5' />
        return <Star className='h-5 w-5' />
    }

    const reservarHabitacion = () => {
        if (habitacion) {
            router.push(`/personalizar-reserva?habitacionId=${habitacion.id}`)
        }
    }

    // Imágenes de ejemplo para la galería
    const imagenesGaleria = [
        habitacion?.imagen || '/images/room-default.jpg',
        '/images/room-bathroom.jpg',
        '/images/room-view.jpg',
        '/images/room-amenities.jpg'
    ]

    if (cargando) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando detalles de la habitación...</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    if (error || !habitacion) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="contenedor text-center">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {error || 'Habitación no encontrada'}
                            </h1>
                            <p className="text-gray-600 mb-8">
                                La habitación que buscas no está disponible o no existe.
                            </p>
                            <button
                                onClick={() => router.push('/habitaciones')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Volver a Habitaciones
                            </button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar onSubPage={true} />
            <main className="min-h-screen bg-gray-50">
                {/* Header */}
                <section className="bg-white border-b border-gray-200">
                    <div className="contenedor py-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a habitaciones
                        </button>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{habitacion.tipo}</h1>
                                <p className="text-gray-600 mt-2">Habitación {habitacion.numero}</p>
                            </div>
                            <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <div className={`
                                    px-4 py-2 rounded-full text-sm font-semibold border-2
                                    ${getEstadoColor(habitacion.estado)}
                                `}>
                                    {habitacion.estado}
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    ${habitacion.precio.toLocaleString()}
                                    <span className="text-sm font-normal text-gray-600"> / noche</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="contenedor py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna principal */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Galería de imágenes */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="relative">
                                    <img
                                        src={imagenPrincipal}
                                        alt={habitacion.tipo}
                                        className="w-full h-96 object-cover cursor-pointer"
                                        onClick={() => setGaleriaAbierta(true)}
                                    />
                                    <button
                                        onClick={() => setGaleriaAbierta(true)}
                                        className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </button>
                                </div>
                                
                                {/* Miniaturas */}
                                <div className="grid grid-cols-4 gap-1 p-1">
                                    {imagenesGaleria.map((imagen, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagenPrincipal(imagen)}
                                            className={`relative h-20 ${
                                                imagenPrincipal === imagen ? 'ring-2 ring-blue-500' : ''
                                            }`}
                                        >
                                            <img
                                                src={imagen}
                                                alt={`Vista ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Descripción y características */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
                                <p className="text-gray-700 leading-relaxed">
                                    {habitacion.descripcion || `Experimenta el máximo confort en nuestra ${habitacion.tipo.toLowerCase()}. Diseñada para ofrecerte una estadía inolvidable con todas las comodidades que necesitas para tu descanso.`}
                                </p>
                            </div>

                            {/* Características principales */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Características Principales</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Ruler className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Tamaño</p>
                                            <p className="text-gray-600">{habitacion.tamaño} m²</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <Users className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Capacidad</p>
                                            <p className="text-gray-600">{habitacion.capacidad} {habitacion.capacidad === 1 ? 'persona' : 'personas'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Bed className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Camas</p>
                                            <p className="text-gray-600">{habitacion.camas}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Bath className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Baño</p>
                                            <p className="text-gray-600">Privado con amenities</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comodidades */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">Comodidades Incluidas</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {habitacion.comodidades.map((comodidad, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            {getIconoComodidad(comodidad)}
                                            <span className="text-gray-700">{comodidad}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Servicios incluidos */}
                            {habitacion.serviciosIncluidos && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Servicios Incluidos</h2>
                                    <div className="space-y-3">
                                        {habitacion.serviciosIncluidos.map((servicio, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span className="text-gray-700">{servicio}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Reserva y información adicional */}
                        <div className="space-y-6">
                            {/* Tarjeta de reserva */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reservar esta Habitación</h3>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Precio por noche:</span>
                                        <span className="text-xl font-bold text-blue-600">
                                            ${habitacion.precio.toLocaleString()}
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span>Impuestos:</span>
                                        <span>Incluidos (19%)</span>
                                    </div>

                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                            <Clock className="h-4 w-4" />
                                            <span>Check-in: 3:00 PM | Check-out: 12:00 PM</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Users className="h-4 w-4" />
                                            <span>Capacidad: {habitacion.capacidad} personas</span>
                                        </div>
                                    </div>

                                    {habitacion.estado === 'DISPONIBLE' ? (
  <button
    onClick={reservarHabitacion}
    className="w-full mt-4 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
>
    Reservar Ahora
</button>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className="text-red-500 mb-2">
                                                <Calendar className="h-8 w-8 mx-auto" />
                                            </div>
                                            <p className="text-red-600 font-semibold">No disponible</p>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Esta habitación no está disponible para reservas en este momento.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Información del hotel */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <h3 className="font-semibold text-blue-900 mb-3">Información del Hotel</h3>
                                <div className="space-y-2 text-sm text-blue-700">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span>Av. Principal #123, Bogotá</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>Recepción 24 horas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4" />
                                        <span>Estacionamiento gratuito</span>
                                    </div>
                                </div>
                            </div>

                            {/* Políticas */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Políticas</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Cancelación gratuita hasta 24 horas antes</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>No se requiere pago anticipado</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Mascotas no permitidas</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                        <span>Prohibido fumar en todas las habitaciones</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de galería */}
                {galeriaAbierta && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                        <div className="max-w-4xl w-full max-h-full">
                            <div className="relative">
                                <button
                                    onClick={() => setGaleriaAbierta(false)}
                                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                                
                                <img
                                    src={imagenesGaleria[imagenActiva]}
                                    alt={`Imagen ${imagenActiva + 1}`}
                                    className="w-full h-96 object-contain"
                                />
                                
                                <div className="flex justify-center mt-4 space-x-2">
                                    {imagenesGaleria.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setImagenActiva(index)}
                                            className={`w-3 h-3 rounded-full ${
                                                index === imagenActiva ? 'bg-white' : 'bg-gray-500'
                                            }`}
                                        />
                                    ))}
                                </div>
                                
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => setImagenActiva(prev => prev > 0 ? prev - 1 : imagenesGaleria.length - 1)}
                                        className="text-white hover:text-gray-300"
                                    >
                                        ‹ Anterior
                                    </button>
                                    <button
                                        onClick={() => setImagenActiva(prev => prev < imagenesGaleria.length - 1 ? prev + 1 : 0)}
                                        className="text-white hover:text-gray-300"
                                    >
                                        Siguiente ›
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}