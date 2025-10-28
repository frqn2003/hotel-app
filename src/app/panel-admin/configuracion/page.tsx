'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Database,
  Shield,
  Bell,
  Mail,
  CreditCard,
  Users,
  Building,
  Globe,
  Clock,
  Wifi,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type ConfiguracionSistema = {
  general: {
    nombreHotel: string
    direccion: string
    telefono: string
    email: string
    moneda: string
    zonaHoraria: string
    idioma: string
  }
  reservas: {
    checkInTime: string
    checkOutTime: string
    maxNoches: number
    minAnticipacion: number
    depositoRequerido: boolean
    porcentajeDeposito: number
    politicaCancelacion: string
  }
  habitaciones: {
    categorias: string[]
    serviciosIncluidos: string[]
    impuestos: {
      iva: number
      tasaMunicipal: number
      tasaTuristica: number
    }
  }
  notificaciones: {
    emailReservas: boolean
    emailCheckins: boolean
    emailCheckouts: boolean
    smsRecordatorios: boolean
    notificacionesSistema: boolean
  }
  seguridad: {
    requerirVerificacion: boolean
    timeoutSesion: number
    intentosMaximos: number
    complejidadPassword: string
  }
  facturacion: {
    puntoVenta: string
    cuit: string
    iiibb: string
    inicioActividades: string
    facturaElectronica: boolean
  }
}

const zonasHorarias = [
  "America/Argentina/Buenos_Aires",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/Madrid",
  "Europe/London",
  "Asia/Tokyo"
]

const monedas = [
  "ARS - Peso Argentino",
  "USD - Dólar Americano",
  "EUR - Euro",
  "BRL - Real Brasileño"
]

const idiomas = [
  "Español",
  "English",
  "Português",
  "Français"
]

const complejidadPasswords = [
  "Baja (6 caracteres mínimos)",
  "Media (8 caracteres, mayúsculas y números)",
  "Alta (10 caracteres, símbolos y números)"
]

const configuracionInicial: ConfiguracionSistema = {
  general: {
    nombreHotel: "Next Lujos Hotel",
    direccion: "Av. del Libertador 1234, CABA, Argentina",
    telefono: "+54 11 1234-5678",
    email: "info@nextlujos.com",
    moneda: "ARS - Peso Argentino",
    zonaHoraria: "America/Argentina/Buenos_Aires",
    idioma: "Español"
  },
  reservas: {
    checkInTime: "14:00",
    checkOutTime: "12:00",
    maxNoches: 30,
    minAnticipacion: 1,
    depositoRequerido: true,
    porcentajeDeposito: 30,
    politicaCancelacion: "48h"
  },
  habitaciones: {
    categorias: ["Suite Presidencial", "Suite Deluxe", "Ejecutiva", "Standard"],
    serviciosIncluidos: ["wifi", "desayuno", "limpieza-diaria", "toallas", "amenities"],
    impuestos: {
      iva: 21,
      tasaMunicipal: 2,
      tasaTuristica: 1.5
    }
  },
  notificaciones: {
    emailReservas: true,
    emailCheckins: true,
    emailCheckouts: true,
    smsRecordatorios: false,
    notificacionesSistema: true
  },
  seguridad: {
    requerirVerificacion: true,
    timeoutSesion: 30,
    intentosMaximos: 3,
    complejidadPassword: "Media (8 caracteres, mayúsculas y números)"
  },
  facturacion: {
    puntoVenta: "0001",
    cuit: "30-12345678-9",
    iiibb: "123-45678-9",
    inicioActividades: "2020-01-01",
    facturaElectronica: true
  }
}

export default function ConfiguracionSistema() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [configuracion, setConfiguracion] = useState<ConfiguracionSistema>(configuracionInicial)
  const [seccionActiva, setSeccionActiva] = useState("general")
  const [guardando, setGuardando] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }

    // Cargar configuración guardada (en una app real, esto vendría de una API)
    const configGuardada = localStorage.getItem("configuracionSistema")
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada))
    }
  }, [])

  const handleConfigChange = (seccion: keyof ConfiguracionSistema, campo: string, valor: unknown) => {
    setConfiguracion(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor
      }
    }))
    setCambiosSinGuardar(true)
  }

  const handleNestedConfigChange = (seccion: keyof ConfiguracionSistema, subseccion: string, campo: string, valor: unknown) => {
    setConfiguracion(prev => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [subseccion]: {
          ...(((prev[seccion] as unknown) as Record<string, unknown>)[subseccion] as Record<string, unknown> || {}),
          [campo]: valor
        }
      }
    }))
    setCambiosSinGuardar(true)
  }

  const guardarConfiguracion = () => {
    setGuardando(true)
    
    // Simular guardado en API
    setTimeout(() => {
      localStorage.setItem("configuracionSistema", JSON.stringify(configuracion))
      setGuardando(false)
      setCambiosSinGuardar(false)
      setMostrarConfirmacion(true)
      
      setTimeout(() => {
        setMostrarConfirmacion(false)
      }, 3000)
    }, 1500)
  }

  const restaurarValoresPorDefecto = () => {
    if (confirm("¿Estás seguro de que deseas restaurar todos los valores por defecto? Se perderán los cambios no guardados.")) {
      setConfiguracion(configuracionInicial)
      setCambiosSinGuardar(true)
    }
  }

  const secciones = [
    { id: "general", nombre: "General", icon: Building },
    { id: "reservas", nombre: "Reservas", icon: Clock },
    { id: "habitaciones", nombre: "Habitaciones", icon: Wifi },
    { id: "notificaciones", nombre: "Notificaciones", icon: Bell },
    { id: "seguridad", nombre: "Seguridad", icon: Shield },
    { id: "facturacion", nombre: "Facturación", icon: CreditCard }
  ]

  const SeccionIcon = secciones.find(s => s.id === seccionActiva)?.icon || Building

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-admin"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Configuración del Sistema</h1>
              <p className="text-gray-600">Gestiona los parámetros y preferencias del hotel</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={restaurarValoresPorDefecto}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Restaurar
              </button>
              <button
                onClick={guardarConfiguracion}
                disabled={!cambiosSinGuardar || guardando}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {guardando ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {guardando ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>

          {/* Confirmación de guardado */}
          {mostrarConfirmacion && (
            <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Configuración guardada exitosamente
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navegación lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="h-6 w-6 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Configuraciones</h2>
                </div>
                <nav className="space-y-2">
                  {secciones.map((seccion) => {
                    const Icon = seccion.icon
                    return (
                      <button
                        key={seccion.id}
                        onClick={() => setSeccionActiva(seccion.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                          seccionActiva === seccion.id
                            ? "bg-black text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{seccion.nombre}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Contenido de la configuración */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-lg p-8">
                {/* Header de la sección */}
                <div className="flex items-center gap-3 mb-8">
                  <SeccionIcon className="h-6 w-6 text-gray-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {secciones.find(s => s.id === seccionActiva)?.nombre}
                    </h2>
                    <p className="text-gray-600">
                      {seccionActiva === "general" && "Configuración básica del hotel"}
                      {seccionActiva === "reservas" && "Parámetros de reservas y políticas"}
                      {seccionActiva === "habitaciones" && "Configuración de habitaciones y servicios"}
                      {seccionActiva === "notificaciones" && "Preferencias de notificaciones"}
                      {seccionActiva === "seguridad" && "Configuración de seguridad del sistema"}
                      {seccionActiva === "facturacion" && "Datos fiscales y facturación"}
                    </p>
                  </div>
                </div>

                {/* Sección General */}
                {seccionActiva === "general" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre del Hotel *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.general.nombreHotel}
                          onChange={(e) => handleConfigChange("general", "nombreHotel", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono *
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.general.telefono}
                          onChange={(e) => handleConfigChange("general", "telefono", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección *
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={configuracion.general.direccion}
                        onChange={(e) => handleConfigChange("general", "direccion", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Moneda Principal
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.general.moneda}
                          onChange={(e) => handleConfigChange("general", "moneda", e.target.value)}
                        >
                          {monedas.map(moneda => (
                            <option key={moneda} value={moneda}>{moneda}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Zona Horaria
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.general.zonaHoraria}
                          onChange={(e) => handleConfigChange("general", "zonaHoraria", e.target.value)}
                        >
                          {zonasHorarias.map(zona => (
                            <option key={zona} value={zona}>{zona}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Idioma Principal
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.general.idioma}
                          onChange={(e) => handleConfigChange("general", "idioma", e.target.value)}
                        >
                          {idiomas.map(idioma => (
                            <option key={idioma} value={idioma}>{idioma}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección Reservas */}
                {seccionActiva === "reservas" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horario Check-in
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.reservas.checkInTime}
                          onChange={(e) => handleConfigChange("reservas", "checkInTime", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Horario Check-out
                        </label>
                        <input
                          type="time"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.reservas.checkOutTime}
                          onChange={(e) => handleConfigChange("reservas", "checkOutTime", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Máximo de noches por reserva
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.reservas.maxNoches}
                          onChange={(e) => handleConfigChange("reservas", "maxNoches", parseInt(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Anticipación mínima (días)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.reservas.minAnticipacion}
                          onChange={(e) => handleConfigChange("reservas", "minAnticipacion", parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={configuracion.reservas.depositoRequerido}
                            onChange={(e) => handleConfigChange("reservas", "depositoRequerido", e.target.checked)}
                            className="rounded border-gray-300 text-black focus:ring-black"
                          />
                          <span className="text-sm font-medium text-gray-700">Requerir depósito de garantía</span>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Porcentaje de depósito (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.reservas.porcentajeDeposito}
                          onChange={(e) => handleConfigChange("reservas", "porcentajeDeposito", parseInt(e.target.value))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Política de cancelación
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={configuracion.reservas.politicaCancelacion}
                        onChange={(e) => handleConfigChange("reservas", "politicaCancelacion", e.target.value)}
                      >
                        <option value="24h">24 horas</option>
                        <option value="48h">48 horas</option>
                        <option value="7d">7 días</option>
                        <option value="14d">14 días</option>
                        <option value="no-refund">No reembolsable</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Sección Habitaciones */}
                {seccionActiva === "habitaciones" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categorías de Habitaciones
                      </label>
                      <div className="space-y-2">
                        {configuracion.habitaciones.categorias.map((categoria, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                              value={categoria}
                              onChange={(e) => {
                                const nuevasCategorias = [...configuracion.habitaciones.categorias]
                                nuevasCategorias[index] = e.target.value
                                handleConfigChange("habitaciones", "categorias", nuevasCategorias)
                              }}
                            />
                            <button
                              onClick={() => {
                                const nuevasCategorias = configuracion.habitaciones.categorias.filter((_, i) => i !== index)
                                handleConfigChange("habitaciones", "categorias", nuevasCategorias)
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <XCircle className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const nuevasCategorias = [...configuracion.habitaciones.categorias, "Nueva Categoría"]
                            handleConfigChange("habitaciones", "categorias", nuevasCategorias)
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                        >
                          + Agregar categoría
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Impuestos Aplicables</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            IVA (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            value={configuracion.habitaciones.impuestos.iva}
                            onChange={(e) => handleNestedConfigChange("habitaciones", "impuestos", "iva", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasa Municipal (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            value={configuracion.habitaciones.impuestos.tasaMunicipal}
                            onChange={(e) => handleNestedConfigChange("habitaciones", "impuestos", "tasaMunicipal", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tasa Turística (%)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                            value={configuracion.habitaciones.impuestos.tasaTuristica}
                            onChange={(e) => handleNestedConfigChange("habitaciones", "impuestos", "tasaTuristica", parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección Notificaciones */}
                {seccionActiva === "notificaciones" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones por Email</h3>
                    <div className="space-y-4">
                      {Object.entries(configuracion.notificaciones).map(([key, value]) => (
                        <label key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                          <div>
                            <p className="font-medium text-gray-900">
                              {key === "emailReservas" && "Notificar nuevas reservas"}
                              {key === "emailCheckins" && "Notificar check-ins"}
                              {key === "emailCheckouts" && "Notificar check-outs"}
                              {key === "smsRecordatorios" && "SMS recordatorios"}
                              {key === "notificacionesSistema" && "Notificaciones del sistema"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {key === "emailReservas" && "Recibir email por cada nueva reserva"}
                              {key === "emailCheckins" && "Alertas de check-in programados"}
                              {key === "emailCheckouts" && "Alertas de check-out programados"}
                              {key === "smsRecordatorios" && "Enviar SMS a huéspedes"}
                              {key === "notificacionesSistema" && "Alertas del sistema y mantenimiento"}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => handleConfigChange("notificaciones", key, e.target.checked)}
                            className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sección Seguridad */}
                {seccionActiva === "seguridad" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Requerir verificación en dos pasos</p>
                          <p className="text-sm text-gray-500">Solicitar código de verificación para accesos administrativos</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={configuracion.seguridad.requerirVerificacion}
                          onChange={(e) => handleConfigChange("seguridad", "requerirVerificacion", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timeout de sesión (minutos)
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.seguridad.timeoutSesion}
                          onChange={(e) => handleConfigChange("seguridad", "timeoutSesion", parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Intentos máximos de login
                        </label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.seguridad.intentosMaximos}
                          onChange={(e) => handleConfigChange("seguridad", "intentosMaximos", parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Complejidad de contraseñas
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.seguridad.complejidadPassword}
                          onChange={(e) => handleConfigChange("seguridad", "complejidadPassword", e.target.value)}
                        >
                          {complejidadPasswords.map(nivel => (
                            <option key={nivel} value={nivel}>{nivel}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección Facturación */}
                {seccionActiva === "facturacion" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Punto de Venta
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.facturacion.puntoVenta}
                          onChange={(e) => handleConfigChange("facturacion", "puntoVenta", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CUIT
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.facturacion.cuit}
                          onChange={(e) => handleConfigChange("facturacion", "cuit", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ingresos Brutos
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.facturacion.iiibb}
                          onChange={(e) => handleConfigChange("facturacion", "iiibb", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Inicio de Actividades
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={configuracion.facturacion.inicioActividades}
                          onChange={(e) => handleConfigChange("facturacion", "inicioActividades", e.target.value)}
                        />
                      </div>
                    </div>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                      <div>
                        <p className="font-medium text-gray-900">Facturación Electrónica</p>
                        <p className="text-sm text-gray-500">Habilitar emisión de facturas electrónicas AFIP</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={configuracion.facturacion.facturaElectronica}
                        onChange={(e) => handleConfigChange("facturacion", "facturaElectronica", e.target.checked)}
                        className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}