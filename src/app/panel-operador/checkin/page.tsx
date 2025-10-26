'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Search,
  User,
  Calendar,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  IdCard,
  Car,
  Bed,
  Wifi,
  Coffee
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type Reserva = {
  id: string
  habitacion: string
  tipoHabitacion: string
  fechaEntrada: string
  fechaSalida: string
  noches: number
  huesped: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    documento: string
    nacionalidad: string
    fechaNacimiento: string
  }
  total: number
  estadoPago: "Pagado" | "Pendiente" | "Parcial"
  serviciosIncluidos: string[]
  preferencias: string[]
}

type FormData = {
  metodoPago: string
  tarjetaCredito?: {
    numero: string
    vencimiento: string
    cvv: string
    titular: string
  }
  documentoIdentidad: string
  firma: string
  vehiculo?: {
    marca: string
    modelo: string
    patente: string
  }
  aceptaTerminos: boolean
}

type FormDataField = keyof FormData

const reservasPendientes: Reserva[] = [
  {
    id: "R-87346",
    habitacion: "204 - Habitación Ejecutiva",
    tipoHabitacion: "Ejecutiva",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "14 Nov 2025",
    noches: 2,
    huesped: {
      nombre: "Carlos",
      apellido: "Rodríguez",
      email: "carlos.rodriguez@email.com",
      telefono: "+54 11 3456-7890",
      documento: "35.678.901",
      nacionalidad: "Argentino",
      fechaNacimiento: "15/03/1985"
    },
    total: 120000,
    estadoPago: "Pagado",
    serviciosIncluidos: ["Desayuno buffet", "Wifi premium", "Estacionamiento", "Acceso al spa"],
    preferencias: ["Almohadas extra", "Check-out tardío", "Habitación alta"]
  },
  {
    id: "R-87348",
    habitacion: "305 - Suite Junior",
    tipoHabitacion: "Suite",
    fechaEntrada: "12 Nov 2025",
    fechaSalida: "13 Nov 2025",
    noches: 1,
    huesped: {
      nombre: "Laura",
      apellido: "Gómez",
      email: "laura.gomez@email.com",
      telefono: "+54 11 5678-9012",
      documento: "27.890.123",
      nacionalidad: "Mexicana",
      fechaNacimiento: "22/07/1990"
    },
    total: 95000,
    estadoPago: "Pendiente",
    serviciosIncluidos: ["Desayuno buffet", "Wifi premium", "Minibar incluido"],
    preferencias: ["Habitación lejos del ascensor", "Sin perfume en la habitación"]
  }
]

export default function CheckinOperador() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [pasoActual, setPasoActual] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    metodoPago: "",
    documentoIdentidad: "",
    firma: "",
    aceptaTerminos: false
  })

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "OPERADOR" && userData.rol !== "ADMIN") {
        window.location.href = "/panel"
        return
      }
      setUserSession(userData)
    }
  }, [])

  const filtrarReservas = reservasPendientes.filter(reserva =>
    reserva.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.huesped.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.huesped.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.habitacion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleInputChange = (field: FormDataField, value: FormData[FormDataField]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckinCompleto = () => {
    // Aquí iría la lógica para procesar el check-in
    alert(`Check-in completado exitosamente para ${reservaSeleccionada?.huesped.nombre} ${reservaSeleccionada?.huesped.apellido}`)
    // Redirigir al panel de operador
    window.location.href = "/panel-operador"
  }

  const getEstadoPagoColor = (estado: string) => {
    switch (estado) {
      case "Pagado":
        return "bg-emerald-50 text-emerald-700"
      case "Pendiente":
        return "bg-amber-50 text-amber-700"
      case "Parcial":
        return "bg-blue-50 text-blue-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-operador"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Procesar Check-in</h1>
              <p className="text-gray-600">Registra la llegada de huéspedes y completa la documentación requerida</p>
            </div>
          </div>

          {!reservaSeleccionada ? (
            /* Vista de búsqueda de reservas */
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reservas pendientes de check-in</h2>
                  <p className="text-gray-600">Selecciona una reserva para procesar el check-in</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por ID, nombre, habitación..."
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent w-full lg:w-80"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-6">
                {filtrarReservas.map((reserva) => (
                  <div
                    key={reserva.id}
                    className="border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition-all cursor-pointer"
                    onClick={() => setReservaSeleccionada(reserva)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-lg font-semibold text-gray-900">{reserva.id}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoPagoColor(reserva.estadoPago)}`}>
                            {reserva.estadoPago}
                          </span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.huesped.nombre} {reserva.huesped.apellido}</p>
                              <p className="text-sm text-gray-500">{reserva.huesped.nacionalidad}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Bed className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.habitacion}</p>
                              <p className="text-sm text-gray-500">{reserva.tipoHabitacion}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.noches} noche(s)</p>
                              <p className="text-sm text-gray-500">{reserva.fechaEntrada} - {reserva.fechaSalida}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors">
                        Procesar Check-in
                      </button>
                    </div>
                  </div>
                ))}

                {filtrarReservas.length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reservas</h3>
                    <p className="text-gray-600">No hay reservas pendientes de check-in que coincidan con tu búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Proceso de check-in */
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Formulario de check-in */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Check-in: {reservaSeleccionada.id}</h2>
                    <p className="text-gray-600">Completa la información requerida para el registro</p>
                  </div>
                  <button
                    onClick={() => setReservaSeleccionada(null)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* Progreso */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((paso) => (
                    <div key={paso} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        paso === pasoActual
                          ? 'bg-black border-black text-white'
                          : paso < pasoActual
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 text-gray-300'
                      }`}>
                        {paso < pasoActual ? <CheckCircle className="h-5 w-5" /> : paso}
                      </div>
                      {paso < 3 && (
                        <div className={`w-20 h-1 ${
                          paso < pasoActual ? 'bg-emerald-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Paso 1: Verificación de datos */}
                {pasoActual === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Verificación de datos</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Documento de identidad</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Número de documento"
                          value={formData.documentoIdentidad}
                          onChange={(e) => handleInputChange('documentoIdentidad', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Datos del huésped</h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Nombre completo</p>
                            <p className="font-semibold">{reservaSeleccionada.huesped.nombre} {reservaSeleccionada.huesped.apellido}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{reservaSeleccionada.huesped.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-semibold">{reservaSeleccionada.huesped.telefono}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Nacionalidad</p>
                            <p className="font-semibold">{reservaSeleccionada.huesped.nacionalidad}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setPasoActual(2)}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Paso 2: Información de pago y vehículo */}
                {pasoActual === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Información adicional</h3>
                    
                    {reservaSeleccionada.estadoPago === "Pendiente" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                        <h4 className="font-semibold text-amber-800 mb-2">Pago pendiente</h4>
                        <p className="text-amber-700 text-sm mb-4">Se requiere procesar el pago antes de completar el check-in.</p>
                        
                        <div className="space-y-4">
                          <label className="block text-sm font-medium text-gray-700">Método de pago</label>
                          <div className="grid gap-3">
                            {['Tarjeta de crédito', 'Tarjeta de débito', 'Efectivo', 'Transferencia'].map((metodo) => (
                              <label key={metodo} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300">
                                <input
                                  type="radio"
                                  name="metodoPago"
                                  value={metodo}
                                  checked={formData.metodoPago === metodo}
                                  onChange={(e) => handleInputChange('metodoPago', e.target.value)}
                                  className="text-black focus:ring-black"
                                />
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <span className="font-medium">{metodo}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Registro de vehículo (opcional)</label>
                      <div className="grid gap-4 md:grid-cols-3">
                        <input
                          type="text"
                          placeholder="Marca"
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Modelo"
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Patente"
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setPasoActual(1)}
                        className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => setPasoActual(3)}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Paso 3: Confirmación y firma */}
                {pasoActual === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Confirmación final</h3>
                    
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Términos y condiciones</h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <p>• El huésped se compromete a respetar las normas del hotel</p>
                        <p>• Check-out antes de las 12:00 PM</p>
                        <p>• Se autoriza el cargo por daños o consumos extras</p>
                        <p>• Política de no fumar en todas las habitaciones</p>
                        <p>• Depósito de garantía sujeto a verificación al check-out</p>
                      </div>
                      
                      <label className="flex items-center gap-3 mt-4">
                        <input
                          type="checkbox"
                          checked={formData.aceptaTerminos}
                          onChange={(e) => handleInputChange('aceptaTerminos', e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm font-medium">El huésped acepta los términos y condiciones</span>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Firma del huésped</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl h-32 flex items-center justify-center">
                        <p className="text-gray-500">Área de firma - Usar tableta de firma digital</p>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setPasoActual(2)}
                        className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleCheckinCompleto}
                        disabled={!formData.aceptaTerminos}
                        className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Completar Check-in
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen de la reserva */}
              <div className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen de la reserva</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Bed className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{reservaSeleccionada.habitacion}</p>
                      <p className="text-sm text-gray-500">{reservaSeleccionada.tipoHabitacion}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{reservaSeleccionada.noches} noche(s)</p>
                      <p className="text-sm text-gray-500">
                        {reservaSeleccionada.fechaEntrada} - {reservaSeleccionada.fechaSalida}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Servicios incluidos</h4>
                    <div className="space-y-2">
                      {reservaSeleccionada.serviciosIncluidos.map((servicio, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {servicio}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Preferencias del huésped</h4>
                    <div className="space-y-2">
                      {reservaSeleccionada.preferencias.map((preferencia, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-blue-500" />
                          {preferencia}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total estadía:</span>
                      <span className="text-xl font-semibold text-gray-900">${reservaSeleccionada.total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Estado del pago:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoPagoColor(reservaSeleccionada.estadoPago)}`}>
                        {reservaSeleccionada.estadoPago}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}