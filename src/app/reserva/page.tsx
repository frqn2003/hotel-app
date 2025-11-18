'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { Calendar, Users, CreditCard, AlertCircle, Loader2, CheckCircle, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { differenceInDays } from 'date-fns'

interface Habitacion {
    id: string
    numero: number
    tipo: string
    precio: number
    capacidad: number
    descripcion: string
    imagen?: string
    estado: string
}

interface Usuario {
    id: string
    nombre: string
    email: string
    rol: string
}

function ReservaContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const habitacionId = searchParams.get('habitacion')

    // Estados
    const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
    const [loading, setLoading] = useState(true)
    const [enviando, setEnviando] = useState(false)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    
    // Datos del formulario
    const [formData, setFormData] = useState({
        fechaEntrada: '',
        fechaSalida: '',
        huespedes: 1,
        notasEspeciales: ''
    })

    const [precioTotal, setPrecioTotal] = useState(0)
    const [diasEstadia, setDiasEstadia] = useState(0)

    // Verificar sesión al montar el componente
    useEffect(() => {
        const session = localStorage.getItem('userSession')
        if (!session) {
            toast.error('Debes iniciar sesión para hacer una reserva')
            router.push('/auth/login?redirect=/reserva?habitacion=' + habitacionId)
            return
        }
        
        try {
            const userData = JSON.parse(session)
            setUsuario(userData)
        } catch (error) {
            console.error('Error al parsear sesión:', error)
            toast.error('Sesión inválida. Por favor, inicia sesión nuevamente')
            router.push('/login')
        }
    }, [])

    // Cargar habitación al montar
    useEffect(() => {
        if (habitacionId && usuario) {
            cargarHabitacion()
        } else if (!habitacionId) {
            toast.error('No se especificó una habitación')
            router.push('/habitaciones')
        }
    }, [habitacionId, usuario])

    // Calcular precio cuando cambian las fechas
    useEffect(() => {
        calcularPrecio()
    }, [formData.fechaEntrada, formData.fechaSalida, habitacion])

    const cargarHabitacion = async () => {
        try {
            setLoading(true)
            // Backend deshabilitado - Usando datos mock
            const habitacionesMock: Habitacion[] = [
                {
                    id: '1',
                    numero: 101,
                    tipo: 'SIMPLE',
                    precio: 50000,
                    estado: 'DISPONIBLE',
                    descripcion: 'Habitación simple con vista a la ciudad',
                    capacidad: 1,
                    imagen: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1170&auto=format&fit=crop'
                },
                {
                    id: '2',
                    numero: 102,
                    tipo: 'DOBLE',
                    precio: 80000,
                    estado: 'DISPONIBLE',
                    descripcion: 'Habitación doble con dos camas',
                    capacidad: 2,
                    imagen: 'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?w=3000'
                },
                {
                    id: '3',
                    numero: 201,
                    tipo: 'SUITE',
                    precio: 150000,
                    estado: 'DISPONIBLE',
                    descripcion: 'Suite de lujo con vista al mar',
                    capacidad: 4,
                    imagen: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=3000'
                }
            ]
            
            const habitacionEncontrada = habitacionesMock.find((h: Habitacion) => h.numero.toString() === habitacionId)
            if (habitacionEncontrada) {
                setHabitacion(habitacionEncontrada)
            } else {
                toast.error('Habitación no encontrada')
                router.push('/habitaciones')
            }
        } catch (error) {
            console.error('Error al cargar habitación:', error)
            toast.error('Error al cargar la habitación')
        } finally {
            setLoading(false)
        }
    }

    const calcularPrecio = () => {
        if (!formData.fechaEntrada || !formData.fechaSalida || !habitacion) {
            setPrecioTotal(0)
            setDiasEstadia(0)
            return
        }

        const entrada = new Date(formData.fechaEntrada)
        const salida = new Date(formData.fechaSalida)
        const dias = differenceInDays(salida, entrada)

        if (dias > 0) {
            setDiasEstadia(dias)
            setPrecioTotal(dias * habitacion.precio)
        } else {
            setDiasEstadia(0)
            setPrecioTotal(0)
        }
    }

    const validarFormulario = () => {
        if (!formData.fechaEntrada || !formData.fechaSalida) {
            toast.error('Debes seleccionar las fechas de entrada y salida')
            return false
        }

        // Crear fechas en hora local para evitar problemas de zona horaria
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)
        
        // Parsear las fechas en hora local (no UTC)
        const [yearEntrada, mesEntrada, diaEntrada] = formData.fechaEntrada.split('-').map(Number)
        const entrada = new Date(yearEntrada, mesEntrada - 1, diaEntrada)
        
        const [yearSalida, mesSalida, diaSalida] = formData.fechaSalida.split('-').map(Number)
        const salida = new Date(yearSalida, mesSalida - 1, diaSalida)

        console.log('🔍 Validación de fechas:', { hoy, entrada, salida })

        if (entrada < hoy) {
            toast.error('La fecha de entrada no puede ser anterior a hoy')
            return false
        }

        if (salida <= entrada) {
            toast.error('La fecha de salida debe ser posterior a la entrada')
            return false
        }

        if (formData.huespedes < 1) {
            toast.error('Debe haber al menos 1 huésped')
            return false
        }

        if (habitacion && formData.huespedes > habitacion.capacidad) {
            toast.error(`Esta habitación tiene capacidad máxima de ${habitacion.capacidad} personas`)
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        console.log('🚀 Iniciando proceso de reserva...')
        console.log('📋 FormData:', formData)
        console.log('👤 Usuario:', usuario)
        console.log('🏨 Habitación:', habitacion)
        console.log('💰 Precio Total:', precioTotal)
        console.log('📅 Días Estadía:', diasEstadia)
        
        if (!validarFormulario()) {
            console.log('❌ Validación fallida')
            return
        }
        
        if (!habitacion) {
            console.log('❌ No hay habitación')
            toast.error('No se encontró la información de la habitación')
            return
        }
        
        // Verificar que el usuario esté logueado
        if (!usuario) {
            console.log('❌ Usuario no logueado')
            toast.error('Debes iniciar sesión para hacer una reserva')
            router.push('/auth/login?redirect=/reserva?habitacion=' + habitacionId)
            return
        }

        try {
            setEnviando(true)
            
            const reservaData = {
                userId: usuario.id,
                roomId: habitacion.id,
                fechaEntrada: formData.fechaEntrada,
                fechaSalida: formData.fechaSalida,
                huespedes: formData.huespedes,
                precioTotal,
                notasEspeciales: formData.notasEspeciales || null
            }

            console.log('📤 Enviando reserva:', reservaData)

            // Backend deshabilitado - Simulación de éxito
            toast.success('¡Reserva simulada exitosamente! (Demo visual)')
            console.log('✅ Reserva simulada:', reservaData)
            
            // Redirigir a página de habitaciones
            setTimeout(() => {
                router.push('/habitaciones')
            }, 2000)
            
            /* Código original comentado
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData)
            })

            const data = await response.json()
            console.log('📥 Respuesta del servidor:', data)

            if (data.success) {
                toast.success('¡Reserva creada exitosamente!')
                console.log('✅ Reserva creada:', data.data)
                setTimeout(() => {
                    router.push('/habitaciones')
                }, 2000)
            } else {
                console.log('❌ Error del servidor:', data.error)
                toast.error(data.error || 'Error al crear la reserva')
            }
            */
        } catch (error) {
            console.error('❌ Error al enviar reserva:', error)
            toast.error('Error al procesar la reserva')
        } finally {
            setEnviando(false)
        }
    }

    if (loading) {
        return (
            <>
                <Navbar onSubPage={true} />
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                </div>
            </>
        )
    }

    if (!habitacion) {
        return null
    }

    return (
        <>
            <Navbar onSubPage={true} />
            <main className="min-h-screen bg-gray-50">
                {/* Header */}
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
                    <div className="contenedor">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-blue-100 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Volver
                        </button>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Reservar Habitación</h1>
                        <p className="text-lg text-blue-100">Completa el formulario para confirmar tu reserva</p>
                    </div>
                </section>

                {/* Contenido */}
                <section className="contenedor py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulario */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles de la Reserva</h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Fechas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline h-4 w-4 mr-2" />
                                                Fecha de Entrada
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.fechaEntrada}
                                                onChange={(e) => setFormData({ ...formData, fechaEntrada: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="inline h-4 w-4 mr-2" />
                                                Fecha de Salida
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.fechaSalida}
                                                onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                                                min={formData.fechaEntrada || new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Huéspedes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="inline h-4 w-4 mr-2" />
                                            Número de Huéspedes
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max={habitacion.capacidad}
                                            value={formData.huespedes}
                                            onChange={(e) => setFormData({ ...formData, huespedes: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Capacidad máxima: {habitacion.capacidad} personas
                                        </p>
                                    </div>

                                    {/* Notas */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Notas Especiales (Opcional)
                                        </label>
                                        <textarea
                                            value={formData.notasEspeciales}
                                            onChange={(e) => setFormData({ ...formData, notasEspeciales: e.target.value })}
                                            rows={4}
                                            placeholder="Ej: Necesito cuna para bebé, cama extra, etc."
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        />
                                    </div>

                                    {/* Botón */}
                                    <button
                                        type="submit"
                                        disabled={enviando || precioTotal === 0}
                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        {enviando ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="h-5 w-5" />
                                                Confirmar Reserva
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Resumen */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen de Reserva</h3>
                                
                                {/* Habitación */}
                                <div className="mb-6">
                                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                        {habitacion.imagen ? (
                                            <img 
                                                src={habitacion.imagen} 
                                                alt={`Habitación ${habitacion.numero}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <h4 className="font-semibold text-lg">Habitación {habitacion.numero}</h4>
                                    <p className="text-gray-600">{habitacion.tipo}</p>
                                    <p className="text-sm text-gray-500 mt-2">{habitacion.descripcion}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Precio por noche</span>
                                        <span className="font-semibold">${habitacion.precio.toLocaleString()}</span>
                                    </div>
                                    
                                    {diasEstadia > 0 && (
                                        <>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Noches</span>
                                                <span className="font-semibold">{diasEstadia}</span>
                                            </div>
                                            
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Huéspedes</span>
                                                <span className="font-semibold">{formData.huespedes}</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="border-t border-gray-200 pt-3 mt-3">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-bold text-lg text-blue-600">
                                                ${precioTotal.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info adicional */}
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex gap-2">
                                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-blue-900">
                                            <p className="font-semibold mb-1">Información importante</p>
                                            <ul className="list-disc list-inside space-y-1 text-blue-800">
                                                <li>Check-in: 14:00 hrs</li>
                                                <li>Check-out: 12:00 hrs</li>
                                                <li>Pago al momento del check-in</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default function Reserva() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <ReservaContent />
        </Suspense>
    )
}