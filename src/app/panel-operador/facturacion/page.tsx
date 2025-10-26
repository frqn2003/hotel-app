'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Plus,
  Calendar,
  User,
  Building,
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Printer,
  Mail,
  Copy,
  MoreVertical,
  Save,
  X
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type Factura = {
  id: string
  numero: string
  reservaId: string
  habitacion: string
  huesped: string
  fechaEmision: string
  fechaVencimiento: string
  total: number
  estado: "Pagada" | "Pendiente" | "Vencida" | "Anulada"
  tipo: "A" | "B" | "C"
  moneda: "ARS" | "USD"
  descripcion: string
  subtotal: number
  impuestos: number
  consumos: Consumo[]
  datosFacturacion?: DatosFacturacion
}

type Consumo = {
  descripcion: string
  cantidad: number
  precioUnitario: number
  total: number
}

type DatosFacturacion = {
  razonSocial: string
  cuit: string
  direccion: string
  email: string
  telefono: string
}

type Filtros = {
  estado: string
  tipo: string
  fechaDesde: string
  fechaHasta: string
  moneda: string
}

type NuevaFacturaData = {
  reservaId: string
  tipo: "A" | "B" | "C"
  moneda: "ARS" | "USD"
  descripcion: string
  consumos: Consumo[]
  datosFacturacion?: DatosFacturacion
}

const facturas: Factura[] = [
  {
    id: "F-2025-001",
    numero: "0001-00001234",
    reservaId: "R-87345",
    habitacion: "301 - Suite Deluxe",
    huesped: "María González",
    fechaEmision: "12 Nov 2025",
    fechaVencimiento: "19 Nov 2025",
    total: 215000,
    estado: "Pagada",
    tipo: "A",
    moneda: "ARS",
    descripcion: "Estadía Suite Deluxe + consumos",
    subtotal: 200000,
    impuestos: 15000,
    consumos: [
      { descripcion: "Estadía (2 noches)", cantidad: 1, precioUnitario: 182000, total: 182000 },
      { descripcion: "Cena Restaurant Gourmet", cantidad: 1, precioUnitario: 18500, total: 18500 },
      { descripcion: "Minibar", cantidad: 1, precioUnitario: 8500, total: 8500 },
      { descripcion: "Lavandería", cantidad: 1, precioUnitario: 12000, total: 12000 }
    ],
    datosFacturacion: {
      razonSocial: "González y Asociados S.A.",
      cuit: "30-12345678-9",
      direccion: "Av. Corrientes 1234, CABA",
      email: "contabilidad@gonzalez.com",
      telefono: "+54 11 4321-5678"
    }
  },
  {
    id: "F-2025-002",
    numero: "0001-00001235",
    reservaId: "R-87346",
    habitacion: "204 - Ejecutiva",
    huesped: "Carlos Rodríguez",
    fechaEmision: "12 Nov 2025",
    fechaVencimiento: "19 Nov 2025",
    total: 120000,
    estado: "Pendiente",
    tipo: "B",
    moneda: "ARS",
    descripcion: "Estadía Habitación Ejecutiva",
    subtotal: 112150,
    impuestos: 7850,
    consumos: [
      { descripcion: "Estadía (2 noches)", cantidad: 1, precioUnitario: 120000, total: 120000 }
    ]
  }
]

const reservasDisponibles = [
  {
    id: "R-87345",
    habitacion: "301 - Suite Deluxe",
    huesped: "María González",
    total: 182000,
    estado: "Check-out realizado",
    consumos: [
      { descripcion: "Estadía (2 noches)", cantidad: 1, precioUnitario: 182000, total: 182000 },
      { descripcion: "Cena Restaurant Gourmet", cantidad: 1, precioUnitario: 18500, total: 18500 },
      { descripcion: "Minibar", cantidad: 1, precioUnitario: 8500, total: 8500 }
    ]
  },
  {
    id: "R-87346",
    habitacion: "204 - Ejecutiva",
    huesped: "Carlos Rodríguez",
    total: 120000,
    estado: "Check-out pendiente",
    consumos: [
      { descripcion: "Estadía (2 noches)", cantidad: 1, precioUnitario: 120000, total: 120000 }
    ]
  },
  {
    id: "R-87347",
    habitacion: "105 - Standard",
    huesped: "Laura Gómez",
    total: 75000,
    estado: "Activa",
    consumos: [
      { descripcion: "Estadía (3 noches)", cantidad: 1, precioUnitario: 75000, total: 75000 }
    ]
  }
]

const estadisticas = {
  total: 335000,
  pendientes: 120000,
  pagadas: 215000,
  vencidas: 0,
  cantidad: 2
}

export default function GestionFacturas() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura | null>(null)
  const [mostrarNuevaFactura, setMostrarNuevaFactura] = useState(false)
  const [filtros, setFiltros] = useState<Filtros>({
    estado: "",
    tipo: "",
    fechaDesde: "",
    fechaHasta: "",
    moneda: ""
  })
  const [nuevaFactura, setNuevaFactura] = useState<NuevaFacturaData>({
    reservaId: "",
    tipo: "B",
    moneda: "ARS",
    descripcion: "",
    consumos: []
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

  const handleFiltroChange = (campo: keyof Filtros, valor: string) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const limpiarFiltros = () => {
    setFiltros({
      estado: "",
      tipo: "",
      fechaDesde: "",
      fechaHasta: "",
      moneda: ""
    })
  }

  const facturasFiltradas = facturas.filter(factura => {
    const coincideBusqueda = 
      factura.numero.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.huesped.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.reservaId.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.habitacion.toLowerCase().includes(busqueda.toLowerCase())

    const coincideEstado = !filtros.estado || factura.estado === filtros.estado
    const coincideTipo = !filtros.tipo || factura.tipo === filtros.tipo
    const coincideMoneda = !filtros.moneda || factura.moneda === filtros.moneda

    return coincideBusqueda && coincideEstado && coincideTipo && coincideMoneda
  })

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pagada":
        return "bg-emerald-50 text-emerald-700"
      case "Pendiente":
        return "bg-amber-50 text-amber-700"
      case "Vencida":
        return "bg-red-50 text-red-700"
      case "Anulada":
        return "bg-gray-50 text-gray-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case "A":
        return "bg-blue-50 text-blue-700"
      case "B":
        return "bg-green-50 text-green-700"
      case "C":
        return "bg-purple-50 text-purple-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  const descargarFactura = (factura: Factura) => {
    alert(`Descargando factura ${factura.numero}...`)
  }

  const enviarPorEmail = (factura: Factura) => {
    alert(`Enviando factura ${factura.numero} por email...`)
  }

  const anularFactura = (factura: Factura) => {
    if (confirm(`¿Estás seguro de que deseas anular la factura ${factura.numero}?`)) {
      alert(`Factura ${factura.numero} anulada correctamente`)
    }
  }

  const handleNuevaFacturaChange = (campo: string, valor: any) => {
    setNuevaFactura(prev => ({
      ...prev,
      [campo]: valor
    }))

    // Si se selecciona una reserva, cargar sus consumos automáticamente
    if (campo === 'reservaId' && valor) {
      const reserva = reservasDisponibles.find(r => r.id === valor)
      if (reserva) {
        setNuevaFactura(prev => ({
          ...prev,
          consumos: reserva.consumos,
          descripcion: `Factura por estadía - ${reserva.habitacion}`
        }))
      }
    }
  }

  const handleDatosFacturacionChange = (campo: string, valor: string) => {
    setNuevaFactura(prev => ({
      ...prev,
      datosFacturacion: {
        ...prev.datosFacturacion,
        [campo]: valor
      } as DatosFacturacion
    }))
  }

  const generarNuevaFactura = () => {
    // Validaciones básicas
    if (!nuevaFactura.reservaId) {
      alert("Por favor, selecciona una reserva")
      return
    }

    if (nuevaFactura.tipo === "A" && !nuevaFactura.datosFacturacion?.cuit) {
      alert("Para factura tipo A es necesario completar los datos de facturación")
      return
    }

    // Generar nueva factura
    const reserva = reservasDisponibles.find(r => r.id === nuevaFactura.reservaId)
    if (!reserva) return

    const subtotal = nuevaFactura.consumos.reduce((sum, consumo) => sum + consumo.total, 0)
    const impuestos = subtotal * 0.21 // 21% de IVA
    const total = subtotal + impuestos

    const nuevaFacturaCompleta: Factura = {
      id: `F-2025-00${facturas.length + 1}`,
      numero: `0001-0000123${facturas.length + 4}`,
      reservaId: nuevaFactura.reservaId,
      habitacion: reserva.habitacion,
      huesped: reserva.huesped,
      fechaEmision: new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }),
      fechaVencimiento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }),
      total,
      estado: "Pendiente",
      tipo: nuevaFactura.tipo,
      moneda: nuevaFactura.moneda,
      descripcion: nuevaFactura.descripcion,
      subtotal,
      impuestos,
      consumos: nuevaFactura.consumos,
      datosFacturacion: nuevaFactura.datosFacturacion
    }

    // En una aplicación real, aquí se enviaría al backend
    alert(`Factura ${nuevaFacturaCompleta.numero} generada exitosamente`)
    
    // Limpiar formulario y cerrar modal
    setNuevaFactura({
      reservaId: "",
      tipo: "B",
      moneda: "ARS",
      descripcion: "",
      consumos: []
    })
    setMostrarNuevaFactura(false)
  }

  const agregarConsumoManual = () => {
    setNuevaFactura(prev => ({
      ...prev,
      consumos: [
        ...prev.consumos,
        { descripcion: "", cantidad: 1, precioUnitario: 0, total: 0 }
      ]
    }))
  }

  const actualizarConsumo = (index: number, campo: string, valor: any) => {
    const nuevosConsumos = [...nuevaFactura.consumos]
    nuevosConsumos[index] = {
      ...nuevosConsumos[index],
      [campo]: valor
    }
    
    // Recalcular total si cambia cantidad o precio
    if (campo === 'cantidad' || campo === 'precioUnitario') {
      nuevosConsumos[index].total = nuevosConsumos[index].cantidad * nuevosConsumos[index].precioUnitario
    }

    setNuevaFactura(prev => ({
      ...prev,
      consumos: nuevosConsumos
    }))
  }

  const eliminarConsumo = (index: number) => {
    setNuevaFactura(prev => ({
      ...prev,
      consumos: prev.consumos.filter((_, i) => i !== index)
    }))
  }

  const calcularTotalNuevaFactura = () => {
    const subtotal = nuevaFactura.consumos.reduce((sum, consumo) => sum + consumo.total, 0)
    const impuestos = subtotal * 0.21
    return {
      subtotal,
      impuestos,
      total: subtotal + impuestos
    }
  }

  const totals = calcularTotalNuevaFactura()

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
              <h1 className="text-3xl font-semibold text-gray-900">Gestión de Facturas</h1>
              <p className="text-gray-600">Administra y emite facturas para huéspedes y empresas</p>
            </div>
            <button 
              onClick={() => setMostrarNuevaFactura(true)}
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nueva Factura
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Total Facturado</p>
              <p className="text-2xl font-semibold text-gray-900">${estadisticas.total.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Pendientes</p>
              <p className="text-2xl font-semibold text-amber-600">${estadisticas.pendientes.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Pagadas</p>
              <p className="text-2xl font-semibold text-emerald-600">${estadisticas.pagadas.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Vencidas</p>
              <p className="text-2xl font-semibold text-red-600">${estadisticas.vencidas.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-2">Cantidad</p>
              <p className="text-2xl font-semibold text-gray-900">{estadisticas.cantidad}</p>
            </div>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por número, huésped, reserva..."
                  className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent w-full"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filtros
              </button>
            </div>

            {/* Filtros expandibles */}
            {mostrarFiltros && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.estado}
                      onChange={(e) => handleFiltroChange('estado', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="Pagada">Pagada</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Vencida">Vencida</option>
                      <option value="Anulada">Anulada</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.tipo}
                      onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                    >
                      <option value="">Todos</option>
                      <option value="A">Factura A</option>
                      <option value="B">Factura B</option>
                      <option value="C">Factura C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Moneda</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                      value={filtros.moneda}
                      onChange={(e) => handleFiltroChange('moneda', e.target.value)}
                    >
                      <option value="">Todas</option>
                      <option value="ARS">ARS ($)</option>
                      <option value="USD">USD (US$)</option>
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={limpiarFiltros}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lista de facturas */}
          <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Facturas Emitidas</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Factura
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Huésped
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Habitación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Emisión
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {facturasFiltradas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {factura.numero}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(factura.tipo)}`}>
                                Factura {factura.tipo}
                              </span>
                              <span className="text-xs text-gray-500">{factura.moneda}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{factura.huesped}</div>
                        <div className="text-sm text-gray-500">{factura.reservaId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{factura.habitacion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{factura.fechaEmision}</div>
                        <div className="text-sm text-gray-500">Vence: {factura.fechaVencimiento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {factura.moneda === 'ARS' ? '$' : 'US$'} {factura.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(factura.estado)}`}>
                          {factura.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setFacturaSeleccionada(factura)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => descargarFactura(factura)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Descargar PDF"
                          >
                            <Download className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => enviarPorEmail(factura)}
                            className="text-gray-600 hover:text-gray-900 transition-colors"
                            title="Enviar por email"
                          >
                            <Mail className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => anularFactura(factura)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Anular factura"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {facturasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron facturas</h3>
                <p className="text-gray-600">No hay facturas que coincidan con los criterios de búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de nueva factura */}
      {mostrarNuevaFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Nueva Factura</h2>
                <button
                  onClick={() => setMostrarNuevaFactura(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reserva *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={nuevaFactura.reservaId}
                    onChange={(e) => handleNuevaFacturaChange('reservaId', e.target.value)}
                  >
                    <option value="">Seleccionar reserva...</option>
                    {reservasDisponibles.map(reserva => (
                      <option key={reserva.id} value={reserva.id}>
                        {reserva.id} - {reserva.habitacion} - {reserva.huesped} (${reserva.total.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Factura *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={nuevaFactura.tipo}
                    onChange={(e) => handleNuevaFacturaChange('tipo', e.target.value)}
                  >
                    <option value="A">Factura A - Responsable Inscripto</option>
                    <option value="B">Factura B - Consumidor Final</option>
                    <option value="C">Factura C - Exportación</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    value={nuevaFactura.moneda}
                    onChange={(e) => handleNuevaFacturaChange('moneda', e.target.value)}
                  >
                    <option value="ARS">Pesos Argentinos (ARS)</option>
                    <option value="USD">Dólares Americanos (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Descripción de la factura..."
                    value={nuevaFactura.descripcion}
                    onChange={(e) => handleNuevaFacturaChange('descripcion', e.target.value)}
                  />
                </div>
              </div>

              {/* Datos de facturación para tipo A */}
              {nuevaFactura.tipo === "A" && (
                <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Datos de Facturación (Requeridos)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Razón Social *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                        value={nuevaFactura.datosFacturacion?.razonSocial || ''}
                        onChange={(e) => handleDatosFacturacionChange('razonSocial', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CUIT *</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                        placeholder="00-00000000-0"
                        value={nuevaFactura.datosFacturacion?.cuit || ''}
                        onChange={(e) => handleDatosFacturacionChange('cuit', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black"
                        value={nuevaFactura.datosFacturacion?.direccion || ''}
                        onChange={(e) => handleDatosFacturacionChange('direccion', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Consumos */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Detalle de Consumos</h4>
                  <button
                    onClick={agregarConsumoManual}
                    className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
                  >
                    + Agregar Consumo
                  </button>
                </div>

                <div className="space-y-4">
                  {nuevaFactura.consumos.map((consumo, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-2xl">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                            value={consumo.descripcion}
                            onChange={(e) => actualizarConsumo(index, 'descripcion', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                            value={consumo.cantidad}
                            onChange={(e) => actualizarConsumo(index, 'cantidad', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Precio Unit.</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
                            value={consumo.precioUnitario}
                            onChange={(e) => actualizarConsumo(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                            value={`${nuevaFactura.moneda === 'ARS' ? '$' : 'US$'} ${consumo.total.toLocaleString()}`}
                            readOnly
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => eliminarConsumo(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">
                      {nuevaFactura.moneda === 'ARS' ? '$' : 'US$'} {totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (21%):</span>
                    <span className="font-semibold">
                      {nuevaFactura.moneda === 'ARS' ? '$' : 'US$'} {totals.impuestos.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span>
                      {nuevaFactura.moneda === 'ARS' ? '$' : 'US$'} {totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setMostrarNuevaFactura(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={generarNuevaFactura}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-emerald-600 transition-colors inline-flex items-center gap-2"
                >
                  <Save className="h-5 w-5" />
                  Generar Factura
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalle de factura existente */}
      {facturaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* ... (código del modal de detalle existente) ... */}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}