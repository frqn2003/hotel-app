'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Calendar, User, MapPin, ArrowLeft, Mail, Phone } from 'lucide-react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'

interface ReservaConfirmada {
    habitacionId: string
    tipo: string
    precio: number
    noches: number
    fechaCheckin: string
    fechaCheckout: string
    adultos: number
    niños: number
    imagen: string
    total: number
    datosPago: {
        nombre: string
        email: string
        telefono: string
        direccion: string
        ciudad: string
        pais: string
    }
    numeroConfirmacion?: string
    fechaReserva?: string
}

export default function ConfirmacionReserva() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [reserva, setReserva] = useState<ReservaConfirmada | null>(null)
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const exito = searchParams.get('exito') === 'true'
        
        if (exito) {
            // Obtener los datos reales de la reserva desde sessionStorage
            const reservaGuardada = sessionStorage.getItem('reservaConfirmada')
            
            if (reservaGuardada) {
                const reservaData = JSON.parse(reservaGuardada)
                setReserva(reservaData)
                console.log('Datos de reserva cargados:', reservaData)
            } else {
                console.error('No se encontraron datos de reserva en sessionStorage')
                // Redirigir a habitaciones si no hay datos
                router.push('/habitaciones')
            }
        } else {
            // Si no viene de un pago exitoso, redirigir
            router.push('/habitaciones')
        }
        
        setCargando(false)
    }, [searchParams, router])

    const descargarPDF = () => {
        if (!reserva) return
        
        // Crear contenido PDF simple (en una app real usarías una librería)
        const contenidoPDF = `
            COMPROBANTE DE RESERVA - NEXT LUJOS HOTEL
            ==========================================
            
            Número de Confirmación: ${reserva.numeroConfirmacion}
            Fecha de Reserva: ${new Date().toLocaleDateString('es-ES')}
            
            DETALLES DE LA RESERVA:
            -----------------------
            Habitación: ${reserva.tipo}
            Check-in: ${new Date(reserva.fechaCheckin).toLocaleDateString('es-ES')}
            Check-out: ${new Date(reserva.fechaCheckout).toLocaleDateString('es-ES')}
            Noches: ${reserva.noches}
            Huéspedes: ${reserva.adultos} adultos, ${reserva.niños} niños
            Total: $${reserva.total.toLocaleString('es-ES')}
            
            INFORMACIÓN DEL HUÉSPED:
            ------------------------
            Nombre: ${reserva.datosPago.nombre}
            Email: ${reserva.datosPago.email}
            Teléfono: ${reserva.datosPago.telefono}
            
            ¡Gracias por tu reserva!
        `
        
        const blob = new Blob([contenidoPDF], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `comprobante-reserva-${reserva.numeroConfirmacion}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const volverAHabitaciones = () => {
        // Limpiar sessionStorage al salir
        sessionStorage.removeItem('reservaConfirmada')
        router.push('/habitaciones')
    }

    if (cargando) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando confirmación...</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    if (!reserva) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="contenedor text-center">
                        <div className="max-w-md mx-auto">
                            <div className="text-red-500 mb-4">
                                <CheckCircle2 className="h-16 w-16 mx-auto" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reserva no encontrada</h1>
                            <p className="text-gray-600 mb-8">
                                No pudimos encontrar los detalles de tu reserva.
                            </p>
                            <button
                                onClick={volverAHabitaciones}
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
                            onClick={volverAHabitaciones}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver a habitaciones
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">¡Reserva Confirmada!</h1>
                    </div>
                </section>

                <div className="contenedor py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Tarjeta de éxito */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0">
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-green-800 mb-2">
                                        ¡Tu reserva ha sido confirmada exitosamente!
                                    </h2>
                                    <p className="text-green-700">
                                        Hemos enviado un email de confirmación a <strong>{reserva.datosPago.email}</strong> 
                                        con todos los detalles de tu reserva.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Detalles de la Reserva */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Detalles de la Reserva
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={reserva.imagen}
                                                alt={reserva.tipo}
                                                className="w-20 h-20 rounded-lg object-cover"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{reserva.tipo}</h4>
                                                <p className="text-blue-600 font-semibold">
                                                    ${reserva.precio.toLocaleString()} / noche
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">Check-in</p>
                                                    <p className="text-gray-600">
                                                        {new Date(reserva.fechaCheckin).toLocaleDateString('es-ES', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                <div>
                                                    <p className="font-medium">Check-out</p>
                                                    <p className="text-gray-600">
                                                        {new Date(reserva.fechaCheckout).toLocaleDateString('es-ES', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Huéspedes</p>
                                                <p className="text-gray-600">
                                                    {reserva.adultos} adulto(s), {reserva.niños} niño(s)
                                                </p>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Total de la estadía:</span>
                                                <span className="text-lg font-semibold text-green-600">
                                                    ${reserva.total.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Incluye {reserva.noches} noche(s) e impuestos
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Información del Huésped */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Información del Huésped
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Nombre completo</p>
                                                <p className="text-gray-600">{reserva.datosPago.nombre}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Email</p>
                                                <p className="text-gray-600">{reserva.datosPago.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Teléfono</p>
                                                <p className="text-gray-600">{reserva.datosPago.telefono}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <div>
                                                <p className="font-medium">Dirección</p>
                                                <p className="text-gray-600">
                                                    {reserva.datosPago.direccion}, {reserva.datosPago.ciudad}, {reserva.datosPago.pais}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información Adicional */}
                            <div className="space-y-6">
                                {/* Número de Confirmación */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        Número de Confirmación
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-700 mb-4">
                                        #{reserva.numeroConfirmacion}
                                    </p>
                                    <p className="text-blue-700 text-sm">
                                        Guarda este número para cualquier consulta sobre tu reserva.
                                    </p>
                                </div>

                                {/* Instrucciones para el Check-in */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Instrucciones para el Check-in
                                    </h3>
                                    
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p>Presenta tu identificación y número de confirmación al llegar.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p>El check-in está disponible a partir de las 3:00 PM.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p>El check-out debe realizarse antes de las 12:00 PM.</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                                            <p>Estacionamiento gratuito disponible para huéspedes.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contacto de Emergencia */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Contacto del Hotel
                                    </h3>
                                    
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p><strong>Teléfono:</strong> +57 1 234 5678</p>
                                        <p><strong>Email:</strong> info@hotelapp.com</p>
                                        <p><strong>Dirección:</strong> Av. Principal #123, Bogotá, Colombia</p>
                                        <p><strong>Horario de atención:</strong> 24/7</p>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <div className="space-y-3">
                                        <button
                                            onClick={descargarPDF}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                                        >
                                            Descargar Comprobante (PDF)
                                        </button>
                                        <button
                                            onClick={volverAHabitaciones}
                                            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                            Hacer Otra Reserva
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}