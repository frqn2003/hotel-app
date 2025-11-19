'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
    ArrowLeft, 
    CreditCard, 
    Calendar, 
    User, 
    Mail, 
    Phone, 
    MapPin,
    Shield,
    CheckCircle2
} from 'lucide-react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'

interface Reserva {
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
}

interface DatosPago {
    nombre: string
    email: string
    telefono: string
    direccion: string
    ciudad: string
    pais: string
    numeroTarjeta: string
    fechaExpiracion: string
    cvv: string
    nombreTitular: string
}

export default function CheckoutPage() {
    const router = useRouter()
    const [reserva, setReserva] = useState<Reserva | null>(null)
    const [datosPago, setDatosPago] = useState<DatosPago>({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        pais: 'Colombia',
        numeroTarjeta: '',
        fechaExpiracion: '',
        cvv: '',
        nombreTitular: ''
    })
    const [cargando, setCargando] = useState(false)
    const [pasoActual, setPasoActual] = useState(1)

    // Cargar reserva del sessionStorage al montar el componente
    useEffect(() => {
        const reservaGuardada = sessionStorage.getItem('reservaActual')
        if (reservaGuardada) {
            setReserva(JSON.parse(reservaGuardada))
        } else {
            // Si no hay reserva, redirigir a habitaciones
            router.push('/habitaciones')
        }
    }, [router])

    const impuestos = reserva ? reserva.total * 0.19 : 0 // 19% IVA
    const total = reserva ? reserva.total + impuestos : 0

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setDatosPago(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const procesarPago = async () => {
        if (!reserva) return
        
        setCargando(true)
        
        try {
            // Backend deshabilitado - Solo demo visual
            // Simular reserva confirmada
            const reservaConfirmada = {
                ...reserva,
                datosPago: datosPago,
                total: total,
                numeroConfirmacion: Math.random().toString(36).substr(2, 9).toUpperCase()
            }
            
            // Guardar en sessionStorage para la página de confirmación
            sessionStorage.setItem('reservaConfirmada', JSON.stringify(reservaConfirmada))
            
            // Limpiar sessionStorage de la reserva actual
            sessionStorage.removeItem('reservaActual')
            
            // Redirigir a página de confirmación con los datos reales
            router.push('/confirmacion-reserva?exito=true')
            
        } catch (error) {
            console.error('Error al procesar el pago:', error)
            alert('Error al procesar el pago. Por favor intenta nuevamente.')
        } finally {
            setCargando(false)
        }
    }

    const formatNumeroTarjeta = (numero: string) => {
        return numero.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
    }

    if (!reserva) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 py-12">
                    <div className="contenedor text-center">
                        <div className="max-w-md mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">No hay reserva activa</h1>
                            <p className="text-gray-600 mb-8">
                                Por favor selecciona una habitación para reservar.
                            </p>
                            <button
                                onClick={() => router.push('/habitaciones')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Explorar Habitaciones
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
                            Volver atrás
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Finalizar Reserva</h1>
                    </div>
                </section>

                <div className="contenedor py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna izquierda - Formularios */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Progreso */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    {[1, 2, 3].map((paso) => (
                                        <div key={paso} className="flex items-center">
                                            <div className={`
                                                flex items-center justify-center w-8 h-8 rounded-full border-2
                                                ${paso === pasoActual 
                                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                                    : paso < pasoActual
                                                    ? 'bg-green-500 border-green-500 text-white'
                                                    : 'border-gray-300 text-gray-500'
                                                }
                                            `}>
                                                {paso < pasoActual ? <CheckCircle2 className="h-4 w-4" /> : paso}
                                            </div>
                                            {paso < 3 && (
                                                <div className={`
                                                    w-16 h-0.5 mx-2
                                                    ${paso < pasoActual ? 'bg-green-500' : 'bg-gray-300'}
                                                `} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Información Personal</span>
                                    <span>Método de Pago</span>
                                    <span>Confirmación</span>
                                </div>
                            </div>

                            {/* Paso 1: Información Personal */}
                            {pasoActual === 1 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Información Personal
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="h-4 w-4 inline mr-1" />
                                                Nombre Completo *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={datosPago.nombre}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="h-4 w-4 inline mr-1" />
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={datosPago.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="h-4 w-4 inline mr-1" />
                                                Teléfono *
                                            </label>
                                            <input
                                                type="tel"
                                                name="telefono"
                                                value={datosPago.telefono}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                País
                                            </label>
                                            <select
                                                name="pais"
                                                value={datosPago.pais}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="Colombia">Colombia</option>
                                                <option value="Argentina">Argentina</option>
                                                <option value="México">México</option>
                                                <option value="España">España</option>
                                                <option value="Estados Unidos">Estados Unidos</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <MapPin className="h-4 w-4 inline mr-1" />
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                name="direccion"
                                                value={datosPago.direccion}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Ciudad
                                            </label>
                                            <input
                                                type="text"
                                                name="ciudad"
                                                value={datosPago.ciudad}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={() => setPasoActual(2)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Continuar al Pago
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2: Método de Pago */}
                            {pasoActual === 2 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        <CreditCard className="h-6 w-6 inline mr-2" />
                                        Método de Pago
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre del Titular *
                                            </label>
                                            <input
                                                type="text"
                                                name="nombreTitular"
                                                value={datosPago.nombreTitular}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de Tarjeta *
                                            </label>
                                            <input
                                                type="text"
                                                name="numeroTarjeta"
                                                value={formatNumeroTarjeta(datosPago.numeroTarjeta)}
                                                onChange={(e) => {
                                                    const valor = e.target.value.replace(/\s/g, '').slice(0, 16)
                                                    setDatosPago(prev => ({ ...prev, numeroTarjeta: valor }))
                                                }}
                                                placeholder="1234 5678 9012 3456"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                maxLength={19}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Fecha de Expiración *
                                            </label>
                                            <input
                                                type="text"
                                                name="fechaExpiracion"
                                                value={datosPago.fechaExpiracion}
                                                onChange={(e) => {
                                                    const valor = e.target.value.replace(/\D/g, '').slice(0, 4)
                                                    if (valor.length >= 2) {
                                                        setDatosPago(prev => ({ 
                                                            ...prev, 
                                                            fechaExpiracion: valor.slice(0, 2) + '/' + valor.slice(2)
                                                        }))
                                                    } else {
                                                        setDatosPago(prev => ({ ...prev, fechaExpiracion: valor }))
                                                    }
                                                }}
                                                placeholder="MM/AA"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                maxLength={5}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                CVV *
                                            </label>
                                            <input
                                                type="text"
                                                name="cvv"
                                                value={datosPago.cvv}
                                                onChange={(e) => {
                                                    const valor = e.target.value.replace(/\D/g, '').slice(0, 3)
                                                    setDatosPago(prev => ({ ...prev, cvv: valor }))
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                maxLength={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                                        <Shield className="h-4 w-4" />
                                        Tus datos de pago están protegidos y encriptados
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={() => setPasoActual(1)}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={() => setPasoActual(3)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Revisar Reserva
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 3: Confirmación */}
                            {pasoActual === 3 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Confirmación de Reserva
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 text-green-800">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span className="font-medium">¡Todo listo!</span>
                                            </div>
                                            <p className="text-green-700 text-sm mt-1">
                                                Revisa los detalles de tu reserva antes de confirmar el pago.
                                            </p>
                                        </div>
                                        
                                        <div className="border-t border-gray-200 pt-4">
                                            <h3 className="font-semibold text-gray-900 mb-3">Resumen de la Reserva</h3>
                                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={reserva.imagen}
                                                        alt={reserva.tipo}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{reserva.tipo}</p>
                                                        <p className="text-sm text-gray-600">
                                                            {reserva.noches} noche(s) • {reserva.adultos} adulto(s), {reserva.niños} niño(s)
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(reserva.fechaCheckin).toLocaleDateString()} - {new Date(reserva.fechaCheckout).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-gray-900">
                                                    ${reserva.total.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between mt-6">
                                        <button
                                            onClick={() => setPasoActual(2)}
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Atrás
                                        </button>
                                        <button
                                            onClick={procesarPago}
                                            disabled={cargando}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {cargando ? 'Procesando...' : 'Confirmar Pago'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna derecha - Resumen */}
                        <div className="space-y-6">
                            {/* Resumen de la Reserva */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tu Reserva</h3>
                                
                                <div className="border-b border-gray-200 pb-4 mb-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={reserva.imagen}
                                            alt={reserva.tipo}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div>
                                            <p className="font-medium text-gray-900">{reserva.tipo}</p>
                                            <p className="text-sm text-gray-600">
                                                {reserva.noches} noche(s)
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>
                                            <Calendar className="h-3 w-3 inline mr-1" />
                                            Check-in: {new Date(reserva.fechaCheckin).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <Calendar className="h-3 w-3 inline mr-1" />
                                            Check-out: {new Date(reserva.fechaCheckout).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <User className="h-3 w-3 inline mr-1" />
                                            {reserva.adultos} adulto(s), {reserva.niños} niño(s)
                                        </p>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="space-y-2 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span>${reserva.total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Impuestos (19%):</span>
                                        <span>${impuestos.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                                        <span>Total:</span>
                                        <span>${total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Información de Seguridad */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900">Pago Seguro</p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Tus datos están protegidos con encriptación SSL de 256 bits.
                                        </p>
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