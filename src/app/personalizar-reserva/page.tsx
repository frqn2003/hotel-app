'use client'

import { useState, useEffect, JSX } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
    ArrowLeft, 
    Calendar, 
    Users, 
    CreditCard, 
    CheckCircle2, 
    Star, 
    Wifi, 
    Tv, 
    Wind,
    Utensils,
    Car,
    Coffee,
    Shirt,
    Plus,
    Minus,
    MessageCircle
} from 'lucide-react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'

interface Habitacion {
    id: string
    numero: number
    tipo: string
    precio: number
    imagen: string
    capacidad: number
    descripcion: string
    comodidades: string[]
    estado: string
}

interface OpcionExtra {
    id: string
    nombre: string
    descripcion: string
    precio: number
    icono: JSX.Element
    categoria: 'comida' | 'servicio' | 'transporte' | 'otros'
}

export default function PersonalizarReserva() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const [datosReserva, setDatosReserva] = useState({
        checkin: '',
        checkout: '',
        adultos: 1,
        niños: 0,
        bebés: 0
    })

    const [opcionesExtras, setOpcionesExtras] = useState<OpcionExtra[]>([
        {
            id: 'desayuno',
            nombre: 'Desayuno Buffet',
            descripcion: 'Desayuno continental completo incluido',
            precio: 25000,
            icono: <Coffee className="h-5 w-5" />,
            categoria: 'comida'
        },
        {
            id: 'parking',
            nombre: 'Estacionamiento',
            descripcion: 'Parqueadero cubierto por toda la estadía',
            precio: 15000,
            icono: <Car className="h-5 w-5" />,
            categoria: 'transporte'
        },
        {
            id: 'late-checkout',
            nombre: 'Late Check-out',
            descripcion: 'Check-out extendido hasta las 3:00 PM',
            precio: 50000,
            icono: <Calendar className="h-5 w-5" />,
            categoria: 'servicio'
        },
        {
            id: 'lavanderia',
            nombre: 'Servicio de Lavandería',
            descripcion: 'Lavado y planchado de 5 prendas',
            precio: 35000,
            icono: <Shirt className="h-5 w-5" />,
            categoria: 'servicio'
        },
        {
            id: 'cena-romantica',
            nombre: 'Cena Romántica',
            descripcion: 'Cena especial en la habitación con vino',
            precio: 120000,
            icono: <Utensils className="h-5 w-5" />,
            categoria: 'comida'
        },
        {
            id: 'masajes',
            nombre: 'Sesión de Masajes',
            descripcion: 'Masaje relajante de 60 minutos',
            precio: 80000,
            icono: <Star className="h-5 w-5" />,
            categoria: 'servicio'
        }
    ])

    const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState<{[key: string]: number}>({})
    const [pedidosEspeciales, setPedidosEspeciales] = useState({
        preferenciasAlimenticias: '',
        alergias: '',
        motivoViaje: '',
        necesidadesEspeciales: '',
        celebracionEspecial: '',
        notasAdicionales: ''
    })

    const [pasoActual, setPasoActual] = useState(1)

    useEffect(() => {
        const habitacionId = searchParams.get('habitacionId')
        
        if (habitacionId) {
            cargarHabitacion(habitacionId)
        } else {
            setError('No se proporcionó ID de habitación')
            setCargando(false)
        }
    }, [searchParams])

    const cargarHabitacion = async (id: string) => {
        try {
            const response = await fetch(`/api/habitaciones/${id}`)
            const data = await response.json()
            
            if (data.success) {
                setHabitacion(data.data)
            } else {
                const habitacionesGuardadas = sessionStorage.getItem('habitacionesLista')
                if (habitacionesGuardadas) {
                    const habitaciones = JSON.parse(habitacionesGuardadas)
                    const habitacionEncontrada = habitaciones.find((h: any) => h.id === id)
                    if (habitacionEncontrada) {
                        setHabitacion(habitacionEncontrada)
                    } else {
                        setError('Habitación no encontrada')
                    }
                } else {
                    setError('Error al cargar habitación')
                }
            }
        } catch (error) {
            console.error('Error al cargar habitación:', error)
            setError('Error de conexión al cargar los datos de la habitación')
        } finally {
            setCargando(false)
        }
    }

    const calcularNoches = () => {
        if (!datosReserva.checkin || !datosReserva.checkout) return 0
        const inicio = new Date(datosReserva.checkin)
        const fin = new Date(datosReserva.checkout)
        const diferencia = fin.getTime() - inicio.getTime()
        return Math.ceil(diferencia / (1000 * 3600 * 24))
    }

    const getIconoComodidad = (comodidad: string) => {
        const lower = comodidad.toLowerCase()
        if (lower.includes('wifi')) return <Wifi className='h-4 w-4' />
        if (lower.includes('tv')) return <Tv className='h-4 w-4' />
        if (lower.includes('aire')) return <Wind className='h-4 w-4' />
        return <Star className='h-4 w-4' />
    }

    const toggleOpcionExtra = (opcionId: string) => {
        setOpcionesSeleccionadas(prev => {
            if (prev[opcionId]) {
                const newState = { ...prev }
                delete newState[opcionId]
                return newState
            } else {
                return { ...prev, [opcionId]: 1 }
            }
        })
    }

    const actualizarCantidadOpcion = (opcionId: string, cantidad: number) => {
        if (cantidad < 0) return
        setOpcionesSeleccionadas(prev => ({
            ...prev,
            [opcionId]: cantidad
        }))
    }

    const calcularTotalOpciones = () => {
        return Object.entries(opcionesSeleccionadas).reduce((total, [opcionId, cantidad]) => {
            const opcion = opcionesExtras.find(o => o.id === opcionId)
            return total + (opcion ? opcion.precio * cantidad : 0)
        }, 0)
    }

    const calcularTotalReserva = () => {
        if (!habitacion) return 0
        const noches = calcularNoches()
        const totalHabitacion = habitacion.precio * noches
        const totalOpciones = calcularTotalOpciones()
        return totalHabitacion + totalOpciones
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setPedidosEspeciales(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const continuarAlPago = async () => {
        if (!habitacion) return
        
        // Validaciones
        if (!datosReserva.checkin || !datosReserva.checkout) {
            alert('Por favor selecciona las fechas de tu estadía')
            return
        }

        const noches = calcularNoches()
        if (noches <= 0) {
            alert('La fecha de check-out debe ser posterior al check-in')
            return
        }

        const totalHuespedes = datosReserva.adultos + datosReserva.niños + datosReserva.bebés
        if (totalHuespedes > habitacion.capacidad) {
            alert(`La habitación tiene capacidad máxima para ${habitacion.capacidad} personas`)
            return
        }

        // Obtener userId de la sesión
        const session = localStorage.getItem('userSession')
        if (!session) {
            alert('Por favor inicia sesión para continuar')
            router.push('/login')
            return
        }

        const userData = JSON.parse(session)
        const userId = userData.id

        const huespedes = datosReserva.adultos + datosReserva.niños + datosReserva.bebés
        const precioTotal = calcularTotalReserva()

        // Preparar datos para enviar a la API
        const datosReservaAPI = {
            userId: userId,
            roomId: habitacion.id,
            fechaEntrada: datosReserva.checkin,
            fechaSalida: datosReserva.checkout,
            huespedes: huespedes,
            precioTotal: precioTotal,
            estado: 'PENDIENTE',
            pagado: false,
            notasEspeciales: pedidosEspeciales.notasAdicionales || ''
        }

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosReservaAPI)
            })

            const data = await response.json()

            if (data.success) {
                // Guardar también en sessionStorage para referencia
                const reserva = {
                    id: data.data.id,
                    habitacionId: habitacion.id,
                    tipo: habitacion.tipo,
                    precio: habitacion.precio,
                    noches: noches,
                    fechaCheckin: datosReserva.checkin,
                    fechaCheckout: datosReserva.checkout,
                    huespedes: huespedes,
                    imagen: habitacion.imagen || '/images/room-default.jpg',
                    opcionesExtras: Object.entries(opcionesSeleccionadas).map(([opcionId, cantidad]) => {
                        const opcion = opcionesExtras.find(o => o.id === opcionId)
                        return {
                            id: opcionId,
                            nombre: opcion?.nombre,
                            cantidad: cantidad,
                            precioUnitario: opcion?.precio,
                            subtotal: opcion ? opcion.precio * cantidad : 0
                        }
                    }),
                    pedidosEspeciales: pedidosEspeciales,
                    total: precioTotal
                }

                console.log('Reserva creada exitosamente:', reserva)
                sessionStorage.setItem('reservaActual', JSON.stringify(reserva))
                
                // Redirigir a mis-reservas
                router.push('/mis-reservas')
            } else {
                alert('Error al crear la reserva: ' + (data.error || 'Error desconocido'))
            }
        } catch (error) {
            console.error('Error al crear reserva:', error)
            alert('Error de conexión al crear la reserva')
        }
    }

    if (cargando) {
        return (
            <>
                <Navbar onSubPage={true} />
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando habitación...</p>
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

    const noches = calcularNoches()
    const totalHuespedes = datosReserva.adultos + datosReserva.niños + datosReserva.bebés
    const totalOpciones = calcularTotalOpciones()
    const totalReserva = calcularTotalReserva()
    const impuestos = totalReserva * 0.19
    const totalConImpuestos = totalReserva + impuestos

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
                        <h1 className="text-3xl font-bold text-gray-900">Personalizar tu Reserva</h1>
                        <p className="text-gray-600 mt-2">Habitación {habitacion.numero} - {habitacion.tipo}</p>
                    </div>
                </section>

                {/* Progreso */}
                <section className="bg-white border-b border-gray-200">
                    <div className="contenedor py-4">
                        <div className="flex items-center justify-center space-x-8">
                            {[1, 2, 3].map((paso) => (
                                <div key={paso} className="flex items-center">
                                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                        paso === pasoActual 
                                            ? 'bg-blue-600 border-blue-600 text-white' 
                                            : paso < pasoActual
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 text-gray-500'
                                    }`}>
                                        {paso < pasoActual ? <CheckCircle2 className="h-4 w-4" /> : paso}
                                    </div>
                                    {paso < 3 && (
                                        <div className={`w-16 h-0.5 mx-4 ${
                                            paso < pasoActual ? 'bg-green-500' : 'bg-gray-300'
                                        }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-16 mt-2 text-sm text-gray-600">
                            <span>Fechas y Huéspedes</span>
                            <span>Servicios Extras</span>
                            <span>Preferencias</span>
                        </div>
                    </div>
                </section>

                <div className="contenedor py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Columna izquierda - Formularios por pasos */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Paso 1: Fechas y Huéspedes */}
                            {pasoActual === 1 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Fechas y Huéspedes
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Calendar className="h-4 w-4 inline mr-1" />
                                                    Fecha de Check-in *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={datosReserva.checkin}
                                                    onChange={(e) => setDatosReserva({...datosReserva, checkin: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Calendar className="h-4 w-4 inline mr-1" />
                                                    Fecha de Check-out *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={datosReserva.checkout}
                                                    onChange={(e) => setDatosReserva({...datosReserva, checkout: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    min={datosReserva.checkin || new Date().toISOString().split('T')[0]}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Users className="h-4 w-4 inline mr-1" />
                                                    Adultos *
                                                </label>
                                                <select
                                                    value={datosReserva.adultos}
                                                    onChange={(e) => setDatosReserva({...datosReserva, adultos: parseInt(e.target.value)})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {[1,2,3,4].map(num => (
                                                        <option key={num} value={num}>{num} {num === 1 ? 'adulto' : 'adultos'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Niños (2-12 años)
                                                </label>
                                                <select
                                                    value={datosReserva.niños}
                                                    onChange={(e) => setDatosReserva({...datosReserva, niños: parseInt(e.target.value)})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {[0,1,2,3].map(num => (
                                                        <option key={num} value={num}>{num} {num === 1 ? 'niño' : 'niños'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Bebés (2 años)
                                                </label>
                                                <select
                                                    value={datosReserva.bebés}
                                                    onChange={(e) => setDatosReserva({...datosReserva, bebés: parseInt(e.target.value)})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {[0,1,2].map(num => (
                                                        <option key={num} value={num}>{num} {num === 1 ? 'bebé' : 'bebés'}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {totalHuespedes > habitacion.capacidad && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                                <p className="text-red-700 text-sm">
                                                    ⚠️ La capacidad máxima de esta habitación es {habitacion.capacidad} persona(s)
                                                </p>
                                            </div>
                                        )}

                                        {noches > 0 && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <p className="text-blue-800 text-sm">
                                                    <strong>Estadía confirmada:</strong> {noches} {noches === 1 ? 'noche' : 'noches'} 
                                                    ({new Date(datosReserva.checkin).toLocaleDateString()} - {new Date(datosReserva.checkout).toLocaleDateString()})
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <button
                                            onClick={() => setPasoActual(2)}
                                            disabled={!datosReserva.checkin || !datosReserva.checkout || noches <= 0 || totalHuespedes > habitacion.capacidad}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Continuar a Servicios
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2: Servicios Extras */}
                            {pasoActual === 2 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        Servicios y Comodidades Extras
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        {opcionesExtras.map((opcion) => (
                                            <div key={opcion.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`p-2 rounded-lg ${
                                                            opcionesSeleccionadas[opcion.id] 
                                                                ? 'bg-blue-100 text-blue-600' 
                                                                : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {opcion.icono}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-gray-900">{opcion.nombre}</h3>
                                                            <p className="text-sm text-gray-600">{opcion.descripcion}</p>
                                                            <p className="text-sm font-semibold text-green-600">
                                                                ${opcion.precio.toLocaleString()} {opcion.categoria === 'servicio' ? 'por servicio' : 'por día'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center space-x-3">
                                                        {opcionesSeleccionadas[opcion.id] ? (
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => actualizarCantidadOpcion(opcion.id, (opcionesSeleccionadas[opcion.id] || 1) - 1)}
                                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                                                >
                                                                    <Minus className="h-3 w-3" />
                                                                </button>
                                                                <span className="w-8 text-center font-medium">
                                                                    {opcionesSeleccionadas[opcion.id]}
                                                                </span>
                                                                <button
                                                                    onClick={() => actualizarCantidadOpcion(opcion.id, (opcionesSeleccionadas[opcion.id] || 0) + 1)}
                                                                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                                                >
                                                                    <Plus className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => toggleOpcionExtra(opcion.id)}
                                                                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                                                            >
                                                                Agregar
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                            Continuar a Preferencias
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 3: Preferencias y Pedidos Especiales */}
                            {pasoActual === 3 && (
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                        <MessageCircle className="h-5 w-5 inline mr-2" />
                                        Tus Preferencias y Pedidos Especiales
                                    </h2>
                                    
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Preferencias alimenticias
                                                </label>
                                                <input
                                                    type="text"
                                                    name="preferenciasAlimenticias"
                                                    value={pedidosEspeciales.preferenciasAlimenticias}
                                                    onChange={handleInputChange}
                                                    placeholder="Ej: Vegetariano, Sin gluten..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Alergias o restricciones
                                                </label>
                                                <input
                                                    type="text"
                                                    name="alergias"
                                                    value={pedidosEspeciales.alergias}
                                                    onChange={handleInputChange}
                                                    placeholder="Ej: Alergia a mariscos, lactosa..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Motivo de tu viaje
                                            </label>
                                            <select
                                                name="motivoViaje"
                                                value={pedidosEspeciales.motivoViaje}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Selecciona el motivo principal</option>
                                                <option value="vacaciones">Vacaciones</option>
                                                <option value="trabajo">Trabajo</option>
                                                <option value="celebracion">Celebración especial</option>
                                                <option value="luna-de-miel">Luna de miel</option>
                                                <option value="aniversario">Aniversario</option>
                                                <option value="otro">Otro</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                ¿Estás celebrando algo especial?
                                            </label>
                                            <input
                                                type="text"
                                                name="celebracionEspecial"
                                                value={pedidosEspeciales.celebracionEspecial}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Aniversario, Cumpleaños, Boda..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Necesidades especiales o preferencias de habitación
                                            </label>
                                            <textarea
                                                name="necesidadesEspeciales"
                                                value={pedidosEspeciales.necesidadesEspeciales}
                                                onChange={handleInputChange}
                                                placeholder="Ej: Piso alto, vista al mar, cama king size..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Notas adicionales para el hotel
                                            </label>
                                            <textarea
                                                name="notasAdicionales"
                                                value={pedidosEspeciales.notasAdicionales}
                                                onChange={handleInputChange}
                                                placeholder="Cualquier solicitud especial que desees que conozcamos..."
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
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
                                            onClick={continuarAlPago}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                        >
                                            Revisar y Pagar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Columna derecha - Resumen */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de la Reserva</h3>
                                
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={habitacion.imagen || '/images/room-default.jpg'}
                                        alt={habitacion.tipo}
                                        className="w-20 h-20 rounded-lg object-cover"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{habitacion.tipo}</h4>
                                        <p className="text-blue-600 font-semibold">
                                            ${habitacion.precio.toLocaleString()} / noche
                                        </p>
                                        <p className="text-sm text-gray-600">Habitación {habitacion.numero}</p>
                                    </div>
                                </div>

                                {/* Comodidades de la habitación */}
                                {habitacion.comodidades && habitacion.comodidades.length > 0 && (
                                    <div className="mb-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Comodidades incluidas:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {habitacion.comodidades.slice(0, 3).map((comodidad, index) => (
                                                <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                                    {comodidad}
                                                </span>
                                            ))}
                                            {habitacion.comodidades.length > 3 && (
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                                                    +{habitacion.comodidades.length - 3} más
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {noches > 0 ? (
                                    <div className="space-y-3 border-t border-gray-200 pt-4">
                                        {/* Estadía */}
                                        <div className="flex justify-between text-sm">
                                            <span>Estadía ({noches} noches)</span>
                                            <span>${(habitacion.precio * noches).toLocaleString()}</span>
                                        </div>

                                        {/* Servicios extras */}
                                        {Object.keys(opcionesSeleccionadas).length > 0 && (
                                            <>
                                                <div className="border-t border-gray-100 pt-2">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Servicios extras:</p>
                                                    {Object.entries(opcionesSeleccionadas).map(([opcionId, cantidad]) => {
                                                        const opcion = opcionesExtras.find(o => o.id === opcionId)
                                                        if (!opcion) return null
                                                        return (
                                                            <div key={opcionId} className="flex justify-between text-sm text-gray-600 mb-1">
                                                                <span>{opcion.nombre} x{cantidad}</span>
                                                                <span>${(opcion.precio * cantidad).toLocaleString()}</span>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                <div className="flex justify-between text-sm border-t border-gray-100 pt-2">
                                                    <span>Subtotal servicios</span>
                                                    <span>${totalOpciones.toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}

                                        {/* Impuestos y total */}
                                        <div className="flex justify-between text-sm">
                                            <span>Impuestos (19%)</span>
                                            <span>${impuestos.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span className="text-green-600">${totalConImpuestos.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        Completa las fechas para ver el total
                                    </div>
                                )}

                                {/* Información de la estadía */}
                                {noches > 0 && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">
                                            <strong>Check-in:</strong> {new Date(datosReserva.checkin).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Check-out:</strong> {new Date(datosReserva.checkout).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Huéspedes:</strong> {totalHuespedes} {totalHuespedes === 1 ? 'persona' : 'personas'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Información Adicional */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-green-900">Cancelación gratuita</p>
                                        <p className="text-sm text-green-700 mt-1">
                                            Cancela hasta 24 horas antes de tu check-in para recibir un reembolso completo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Asistencia */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-900">¿Necesitas ayuda?</p>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Llámanos al +57 1 234 5678 o escríbenos a info@hotel.com
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