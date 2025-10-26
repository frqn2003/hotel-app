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
  Receipt,
  Calculator,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Package,
  Utensils,
  Minus,
  Plus,
  Printer
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type Reserva = {
  id: string
  habitacion: string
  tipoHabitacion: string
  fechaEntrada: string
  fechaSalida: string
  fechaCheckin: string
  noches: number
  huesped: {
    nombre: string
    apellido: string
    email: string
    telefono: string
    documento: string
    nacionalidad: string
  }
  totalBase: number
  consumos: Consumo[]
  cargosExtras: CargoExtra[]
  estadoPago: "Pagado" | "Pendiente" | "Parcial"
}

type Consumo = {
  id: string
  descripcion: string
  fecha: string
  cantidad: number
  precioUnitario: number
  total: number
  categoria: "restaurante" | "minibar" | "spa" | "lavanderia" | "otros"
}

type CargoExtra = {
  id: string
  descripcion: string
  monto: number
  motivo: string
}

type FormData = {
  metodoPago: string
  propina: number
  observaciones: string
  facturaSolicitada: boolean
  datosFacturacion?: {
    razonSocial: string
    cuit: string
    direccion: string
  }
}

const reservasCheckout: Reserva[] = [
  {
    id: "R-87345",
    habitacion: "301 - Suite Deluxe",
    tipoHabitacion: "Suite",
    fechaEntrada: "10 Nov 2025",
    fechaSalida: "12 Nov 2025",
    fechaCheckin: "10 Nov 2025 - 14:30",
    noches: 2,
    huesped: {
      nombre: "María",
      apellido: "González",
      email: "maria.gonzalez@email.com",
      telefono: "+54 11 2345-6789",
      documento: "30.123.456",
      nacionalidad: "Argentino"
    },
    totalBase: 182000,
    consumos: [
      {
        id: "C-001",
        descripcion: "Cena Restaurant Gourmet",
        fecha: "10 Nov 2025 - 20:15",
        cantidad: 1,
        precioUnitario: 18500,
        total: 18500,
        categoria: "restaurante"
      },
      {
        id: "C-002",
        descripcion: "Minibar - Bebidas",
        fecha: "11 Nov 2025 - 22:30",
        cantidad: 1,
        precioUnitario: 8500,
        total: 8500,
        categoria: "minibar"
      },
      {
        id: "C-003",
        descripcion: "Servicio de lavandería",
        fecha: "11 Nov 2025 - 10:00",
        cantidad: 1,
        precioUnitario: 12000,
        total: 12000,
        categoria: "lavanderia"
      }
    ],
    cargosExtras: [
      {
        id: "E-001",
        descripcion: "Tasa municipal",
        monto: 2000,
        motivo: "Impuesto municipal obligatorio"
      }
    ],
    estadoPago: "Parcial"
  },
  {
    id: "R-87347",
    habitacion: "401 - Suite Presidencial",
    tipoHabitacion: "Suite Presidencial",
    fechaEntrada: "11 Nov 2025",
    fechaSalida: "12 Nov 2025",
    fechaCheckin: "11 Nov 2025 - 16:00",
    noches: 1,
    huesped: {
      nombre: "Ana",
      apellido: "Martínez",
      email: "ana.martinez@email.com",
      telefono: "+54 11 4567-8901",
      documento: "27.890.123",
      nacionalidad: "Mexicana"
    },
    totalBase: 350000,
    consumos: [
      {
        id: "C-004",
        descripcion: "Tratamiento spa premium",
        fecha: "11 Nov 2025 - 17:30",
        cantidad: 1,
        precioUnitario: 25000,
        total: 25000,
        categoria: "spa"
      }
    ],
    cargosExtras: [],
    estadoPago: "Pagado"
  }
]

const categoriasConsumos = {
  restaurante: { color: "bg-blue-100 text-blue-700", icon: Utensils },
  minibar: { color: "bg-green-100 text-green-700", icon: Package },
  spa: { color: "bg-purple-100 text-purple-700", icon: "💆" },
  lavanderia: { color: "bg-amber-100 text-amber-700", icon: "👔" },
  otros: { color: "bg-gray-100 text-gray-700", icon: "📦" }
}

export default function CheckoutOperador() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [reservaSeleccionada, setReservaSeleccionada] = useState<Reserva | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [pasoActual, setPasoActual] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    metodoPago: "",
    propina: 0,
    observaciones: "",
    facturaSolicitada: false
  })
  const [mostrarAgregarConsumo, setMostrarAgregarConsumo] = useState(false)
  const [nuevoConsumo, setNuevoConsumo] = useState({
    descripcion: "",
    cantidad: 1,
    precioUnitario: 0,
    categoria: "otros" as const
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

  const filtrarReservas = reservasCheckout.filter(reserva =>
    reserva.id.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.huesped.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.huesped.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    reserva.habitacion.toLowerCase().includes(busqueda.toLowerCase())
  )

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const calcularTotales = () => {
    if (!reservaSeleccionada) return { subtotal: 0, total: 0 }

    const subtotalConsumos = reservaSeleccionada.consumos.reduce((sum, consumo) => sum + consumo.total, 0)
    const subtotalExtras = reservaSeleccionada.cargosExtras.reduce((sum, extra) => sum + extra.monto, 0)
    const subtotal = reservaSeleccionada.totalBase + subtotalConsumos + subtotalExtras
    const total = subtotal + formData.propina

    return { subtotal, total }
  }

  const handleCheckoutCompleto = () => {
    // Aquí iría la lógica para procesar el checkout
    alert(`Check-out completado exitosamente para ${reservaSeleccionada?.huesped.nombre} ${reservaSeleccionada?.huesped.apellido}`)
    // Redirigir al panel de operador
    window.location.href = "/panel-operador"
  }

  const agregarConsumo = () => {
    if (!reservaSeleccionada) return

    const consumo: Consumo = {
      id: `C-${Date.now()}`,
      descripcion: nuevoConsumo.descripcion,
      fecha: new Date().toLocaleString('es-AR'),
      cantidad: nuevoConsumo.cantidad,
      precioUnitario: nuevoConsumo.precioUnitario,
      total: nuevoConsumo.cantidad * nuevoConsumo.precioUnitario,
      categoria: nuevoConsumo.categoria
    }

    const reservaActualizada = {
      ...reservaSeleccionada,
      consumos: [...reservaSeleccionada.consumos, consumo]
    }

    setReservaSeleccionada(reservaActualizada)
    setMostrarAgregarConsumo(false)
    setNuevoConsumo({
      descripcion: "",
      cantidad: 1,
      precioUnitario: 0,
      categoria: "otros"
    })
  }

  const eliminarConsumo = (id: string) => {
    if (!reservaSeleccionada) return

    const reservaActualizada = {
      ...reservaSeleccionada,
      consumos: reservaSeleccionada.consumos.filter(consumo => consumo.id !== id)
    }

    setReservaSeleccionada(reservaActualizada)
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

  const getCategoriaColor = (categoria: string) => {
    return categoriasConsumos[categoria as keyof typeof categoriasConsumos] || categoriasConsumos.otros
  }

  const { subtotal, total } = calcularTotales()

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
              <h1 className="text-3xl font-semibold text-gray-900">Procesar Check-out</h1>
              <p className="text-gray-600">Gestiona salidas, calcula consumos y procesa pagos finales</p>
            </div>
          </div>

          {!reservaSeleccionada ? (
            /* Vista de búsqueda de reservas */
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Reservas para check-out</h2>
                  <p className="text-gray-600">Selecciona una reserva para procesar el check-out</p>
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
                          <span className="text-sm text-gray-500">
                            Check-in: {reserva.fechaCheckin}
                          </span>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.huesped.nombre} {reserva.huesped.apellido}</p>
                              <p className="text-sm text-gray-500">{reserva.huesped.nacionalidad}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.habitacion}</p>
                              <p className="text-sm text-gray-500">{reserva.tipoHabitacion}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">{reserva.noches} noche(s)</p>
                              <p className="text-sm text-gray-500">{reserva.fechaSalida}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calculator className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-semibold text-gray-900">${reserva.totalBase.toLocaleString()}</p>
                              <p className="text-sm text-gray-500">{reserva.consumos.length} consumos</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors">
                        Procesar Check-out
                      </button>
                    </div>
                  </div>
                ))}

                {filtrarReservas.length === 0 && (
                  <div className="text-center py-12">
                    <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron reservas</h3>
                    <p className="text-gray-600">No hay reservas pendientes de check-out que coincidan con tu búsqueda.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Proceso de check-out */
            <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
              {/* Formulario de check-out */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Check-out: {reservaSeleccionada.id}</h2>
                    <p className="text-gray-600">Revisa consumos y procesa el pago final</p>
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

                {/* Paso 1: Revisión de consumos */}
                {pasoActual === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-900">Revisión de consumos</h3>
                      <button
                        onClick={() => setMostrarAgregarConsumo(true)}
                        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
                      >
                        + Agregar consumo
                      </button>
                    </div>

                    {/* Modal agregar consumo */}
                    {mostrarAgregarConsumo && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                          <h4 className="text-lg font-semibold mb-4">Agregar consumo</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                value={nuevoConsumo.descripcion}
                                onChange={(e) => setNuevoConsumo(prev => ({ ...prev, descripcion: e.target.value }))}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setNuevoConsumo(prev => ({ ...prev, cantidad: Math.max(1, prev.cantidad - 1) }))}
                                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="w-12 text-center">{nuevoConsumo.cantidad}</span>
                                  <button
                                    onClick={() => setNuevoConsumo(prev => ({ ...prev, cantidad: prev.cantidad + 1 }))}
                                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio unitario</label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                  value={nuevoConsumo.precioUnitario}
                                  onChange={(e) => setNuevoConsumo(prev => ({ ...prev, precioUnitario: Number(e.target.value) }))}
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                                value={nuevoConsumo.categoria}
                                onChange={(e) => setNuevoConsumo(prev => ({ ...prev, categoria: e.target.value as any }))}
                              >
                                <option value="restaurante">Restaurante</option>
                                <option value="minibar">Minibar</option>
                                <option value="spa">Spa</option>
                                <option value="lavanderia">Lavandería</option>
                                <option value="otros">Otros</option>
                              </select>
                            </div>
                            <div className="flex gap-3 justify-end">
                              <button
                                onClick={() => setMostrarAgregarConsumo(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={agregarConsumo}
                                disabled={!nuevoConsumo.descripcion || nuevoConsumo.precioUnitario <= 0}
                                className="bg-black text-white px-4 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                              >
                                Agregar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {reservaSeleccionada.consumos.map((consumo) => {
                        const categoria = getCategoriaColor(consumo.categoria)
                        return (
                          <div key={consumo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                            <div className="flex items-center gap-3">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center ${categoria.color}`}>
                                {typeof categoria.icon === 'string' ? (
                                  <span>{categoria.icon}</span>
                                ) : (
                                  <categoria.icon className="h-4 w-4" />
                                )}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-900">{consumo.descripcion}</p>
                                <p className="text-sm text-gray-500">{consumo.fecha}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">${consumo.total.toLocaleString()}</p>
                                <p className="text-sm text-gray-500">{consumo.cantidad} x ${consumo.precioUnitario.toLocaleString()}</p>
                              </div>
                              <button
                                onClick={() => eliminarConsumo(consumo.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      {reservaSeleccionada.consumos.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No hay consumos registrados</p>
                        </div>
                      )}
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

                {/* Paso 2: Resumen y pago */}
                {pasoActual === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Resumen y pago final</h3>
                    
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Detalle de cargos</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Estadía ({reservaSeleccionada.noches} noches)</span>
                          <span className="font-semibold">${reservaSeleccionada.totalBase.toLocaleString()}</span>
                        </div>
                        
                        {reservaSeleccionada.consumos.map(consumo => (
                          <div key={consumo.id} className="flex justify-between">
                            <span className="text-gray-600">{consumo.descripcion}</span>
                            <span>${consumo.total.toLocaleString()}</span>
                          </div>
                        ))}
                        
                        {reservaSeleccionada.cargosExtras.map(extra => (
                          <div key={extra.id} className="flex justify-between">
                            <span className="text-gray-600">{extra.descripcion}</span>
                            <span>${extra.monto.toLocaleString()}</span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold">${subtotal.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Propina (opcional)</label>
                      <div className="flex gap-2">
                        {[0, 500, 1000, 2000, 5000].map((monto) => (
                          <button
                            key={monto}
                            onClick={() => handleInputChange('propina', monto)}
                            className={`flex-1 py-3 rounded-xl border font-medium transition-colors ${
                              formData.propina === monto
                                ? 'bg-black text-white border-black'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {monto === 0 ? 'Sin propina' : `$${monto.toLocaleString()}`}
                          </button>
                        ))}
                      </div>
                    </div>

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

                    <div className="flex justify-between">
                      <button
                        onClick={() => setPasoActual(1)}
                        className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={() => setPasoActual(3)}
                        disabled={!formData.metodoPago}
                        className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                )}

                {/* Paso 3: Confirmación final */}
                {pasoActual === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Confirmación final</h3>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                        <h4 className="font-semibold text-emerald-800">Resumen listo para procesar</h4>
                      </div>
                      
                      <div className="space-y-2 text-sm text-emerald-700">
                        <p><strong>Total a pagar:</strong> ${total.toLocaleString()}</p>
                        <p><strong>Método de pago:</strong> {formData.metodoPago}</p>
                        <p><strong>Propina:</strong> ${formData.propina.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={formData.facturaSolicitada}
                          onChange={(e) => handleInputChange('facturaSolicitada', e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm font-medium">El huésped solicita factura A</span>
                      </label>

                      {formData.facturaSolicitada && (
                        <div className="grid gap-4 md:grid-cols-2">
                          <input
                            type="text"
                            placeholder="Razón social"
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                          />
                          <input
                            type="text"
                            placeholder="CUIT"
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                          />
                          <input
                            type="text"
                            placeholder="Dirección"
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black md:col-span-2"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Notas adicionales sobre el check-out..."
                        value={formData.observaciones}
                        onChange={(e) => handleInputChange('observaciones', e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setPasoActual(2)}
                        className="text-gray-600 hover:text-gray-900 px-6 py-3 rounded-xl font-medium transition-colors"
                      >
                        Atrás
                      </button>
                      <div className="flex gap-3">
                        <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                          <Printer className="h-4 w-4" />
                          Imprimir
                        </button>
                        <button
                          onClick={handleCheckoutCompleto}
                          className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors"
                        >
                          Completar Check-out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen de la cuenta */}
              <div className="bg-white rounded-3xl shadow-lg p-6 h-fit sticky top-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Resumen de la cuenta</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <User className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900">{reservaSeleccionada.huesped.nombre} {reservaSeleccionada.huesped.apellido}</p>
                      <p className="text-sm text-gray-500">Habitación {reservaSeleccionada.habitacion}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Detalle de pagos</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estadía base</span>
                        <span className="font-semibold">${reservaSeleccionada.totalBase.toLocaleString()}</span>
                      </div>
                      
                      {reservaSeleccionada.consumos.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Consumos</span>
                          <span>${reservaSeleccionada.consumos.reduce((sum, c) => sum + c.total, 0).toLocaleString()}</span>
                        </div>
                      )}
                      
                      {reservaSeleccionada.cargosExtras.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cargos extras</span>
                          <span>${reservaSeleccionada.cargosExtras.reduce((sum, e) => sum + e.monto, 0).toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold">${subtotal.toLocaleString()}</span>
                      </div>
                      
                      {formData.propina > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Propina</span>
                          <span>${formData.propina.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-lg font-semibold text-gray-900">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Información de la estadía</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{reservaSeleccionada.fechaCheckin}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{new Date().toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duración:</span>
                        <span>{reservaSeleccionada.noches} noche(s)</span>
                      </div>
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