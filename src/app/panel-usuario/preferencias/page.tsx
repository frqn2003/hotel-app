'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Save,
  Bell,
  Utensils,
  Snowflake,
  Wifi,
  Car,
  Coffee,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  Shield,
  CreditCard,
  Home,
  MapPin
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO"
}

type PreferenciasUsuario = {
  notificaciones: {
    emailReservas: boolean
    emailPromociones: boolean
    emailNoticias: boolean
    smsRecordatorios: boolean
    notificacionesPush: boolean
  }
  habitacion: {
    tipoAlmohada: "suave" | "media" | "firme"
    temperatura: "fria" | "templada" | "calida"
    pisoPreferido: "bajo" | "medio" | "alto"
    lejosAscensor: boolean
    vistaExterior: boolean
  }
  servicios: {
    desayunoEnHabitacion: boolean
    servicioLavanderia: boolean
    accesoGimnasio: boolean
    accesoSpa: boolean
    estacionamiento: boolean
    wifiPremium: boolean
  }
  preferenciasEspeciales: {
    alergias: string
    restriccionesAlimentarias: string
    necesidadesEspeciales: string
    mascotas: boolean
    fumador: boolean
  }
  datosContacto: {
    telefonoMovil: string
    telefonoTrabajo: string
    direccion: string
    ciudad: string
    codigoPostal: string
    pais: string
    emailSecundario: string
  }
  privacidad: {
    perfilPublico: boolean
    mostrarEstadias: boolean
    compartirDatosSocios: boolean
    recibirPublicidad: boolean
    mostrarEmail: boolean
    mostrarTelefono: boolean
    historialNavegacion: boolean
    cookiesPersonalizadas: boolean
  }
}

const preferenciasIniciales: PreferenciasUsuario = {
  notificaciones: {
    emailReservas: true,
    emailPromociones: true,
    emailNoticias: false,
    smsRecordatorios: true,
    notificacionesPush: false
  },
  habitacion: {
    tipoAlmohada: "media",
    temperatura: "templada",
    pisoPreferido: "alto",
    lejosAscensor: true,
    vistaExterior: true
  },
  servicios: {
    desayunoEnHabitacion: true,
    servicioLavanderia: false,
    accesoGimnasio: true,
    accesoSpa: false,
    estacionamiento: true,
    wifiPremium: true
  },
  preferenciasEspeciales: {
    alergias: "",
    restriccionesAlimentarias: "Vegetariano",
    necesidadesEspeciales: "",
    mascotas: false,
    fumador: false
  },
  datosContacto: {
    telefonoMovil: "+54 11 2345-6789",
    telefonoTrabajo: "+54 11 4321-5678",
    direccion: "Av. Corrientes 1234",
    ciudad: "Buenos Aires",
    codigoPostal: "C1043",
    pais: "Argentina",
    emailSecundario: "backup@email.com"
  },
  privacidad: {
    perfilPublico: false,
    mostrarEstadias: true,
    compartirDatosSocios: false,
    recibirPublicidad: true,
    mostrarEmail: false,
    mostrarTelefono: false,
    historialNavegacion: true,
    cookiesPersonalizadas: true
  }
}

export default function GestionarPreferencias() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [preferencias, setPreferencias] = useState<PreferenciasUsuario>(preferenciasIniciales)
  const [seccionActiva, setSeccionActiva] = useState("notificaciones")
  const [guardando, setGuardando] = useState(false)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      setUserSession(JSON.parse(session))
    }

    // Cargar preferencias guardadas (en una app real, esto vendría de una API)
    const preferenciasGuardadas = localStorage.getItem("preferenciasUsuario")
    if (preferenciasGuardadas) {
      setPreferencias(JSON.parse(preferenciasGuardadas))
    }
  }, [])

  const handlePreferenciaChange = (categoria: keyof PreferenciasUsuario, campo: string, valor: any) => {
    setPreferencias(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: valor
      }
    }))
    setCambiosSinGuardar(true)
  }

  const guardarPreferencias = () => {
    setGuardando(true)
    
    // Simular guardado en API
    setTimeout(() => {
      localStorage.setItem("preferenciasUsuario", JSON.stringify(preferencias))
      setGuardando(false)
      setCambiosSinGuardar(false)
      setMostrarConfirmacion(true)
      
      setTimeout(() => {
        setMostrarConfirmacion(false)
      }, 3000)
    }, 1500)
  }

  const secciones = [
    { id: "notificaciones", nombre: "Notificaciones", icon: Bell },
    { id: "habitacion", nombre: "Preferencias de Habitación", icon: Home },
    { id: "servicios", nombre: "Servicios", icon: Wifi },
    { id: "preferenciasEspeciales", nombre: "Preferencias Especiales", icon: User },
    { id: "datosContacto", nombre: "Datos de Contacto", icon: Phone },
    { id: "privacidad", nombre: "Privacidad", icon: Shield }
  ]

  const SeccionIcon = secciones.find(s => s.id === seccionActiva)?.icon || Bell

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-usuario"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Gestionar Preferencias</h1>
              <p className="text-gray-600">Personaliza tu experiencia y preferencias de estadía</p>
            </div>
            <button
              onClick={guardarPreferencias}
              disabled={!cambiosSinGuardar || guardando}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {guardando ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save className="h-5 w-5" />
              )}
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>

          {/* Confirmación de guardado */}
          {mostrarConfirmacion && (
            <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
              <Save className="h-5 w-5" />
              Preferencias guardadas exitosamente
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Navegación lateral */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-lg p-6 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <User className="h-6 w-6 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">Mis Preferencias</h2>
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

            {/* Contenido de las preferencias */}
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
                      {seccionActiva === "notificaciones" && "Configura cómo y cuándo recibir notificaciones"}
                      {seccionActiva === "habitacion" && "Personaliza tus preferencias de habitación"}
                      {seccionActiva === "servicios" && "Selecciona los servicios que prefieres"}
                      {seccionActiva === "preferenciasEspeciales" && "Información importante para tu estadía"}
                      {seccionActiva === "datosContacto" && "Actualiza tu información de contacto"}
                      {seccionActiva === "privacidad" && "Controla tu privacidad y datos personales"}
                    </p>
                  </div>
                </div>

                {/* Sección Notificaciones */}
                {seccionActiva === "notificaciones" && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900">Preferencias de Email</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Confirmaciones de reserva</p>
                            <p className="text-sm text-gray-500">Recibir emails de confirmación y recordatorios</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.notificaciones.emailReservas}
                          onChange={(e) => handlePreferenciaChange("notificaciones", "emailReservas", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Ofertas y promociones</p>
                            <p className="text-sm text-gray-500">Recibir ofertas exclusivas y descuentos</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.notificaciones.emailPromociones}
                          onChange={(e) => handlePreferenciaChange("notificaciones", "emailPromociones", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Noticias del hotel</p>
                            <p className="text-sm text-gray-500">Novedades, eventos y actualizaciones</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.notificaciones.emailNoticias}
                          onChange={(e) => handlePreferenciaChange("notificaciones", "emailNoticias", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mt-8">Otras Notificaciones</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">SMS recordatorios</p>
                            <p className="text-sm text-gray-500">Recordatorios de check-in por SMS</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.notificaciones.smsRecordatorios}
                          onChange={(e) => handlePreferenciaChange("notificaciones", "smsRecordatorios", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Notificaciones push</p>
                            <p className="text-sm text-gray-500">Alertas en tiempo real en tu dispositivo</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.notificaciones.notificacionesPush}
                          onChange={(e) => handlePreferenciaChange("notificaciones", "notificacionesPush", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Sección Habitación */}
                {seccionActiva === "habitacion" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Almohada Preferido
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.habitacion.tipoAlmohada}
                          onChange={(e) => handlePreferenciaChange("habitacion", "tipoAlmohada", e.target.value)}
                        >
                          <option value="suave">Suave</option>
                          <option value="media">Media</option>
                          <option value="firme">Firme</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Temperatura Preferida
                        </label>
                        <select
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.habitacion.temperatura}
                          onChange={(e) => handlePreferenciaChange("habitacion", "temperatura", e.target.value)}
                        >
                          <option value="fria">Fría</option>
                          <option value="templada">Templada</option>
                          <option value="calida">Cálida</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Piso Preferido
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={preferencias.habitacion.pisoPreferido}
                        onChange={(e) => handlePreferenciaChange("habitacion", "pisoPreferido", e.target.value)}
                      >
                        <option value="bajo">Bajo (1-3)</option>
                        <option value="medio">Medio (4-7)</option>
                        <option value="alto">Alto (8+)</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Home className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Habitación lejos del ascensor</p>
                            <p className="text-sm text-gray-500">Prefiero una ubicación más tranquila</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.habitacion.lejosAscensor}
                          onChange={(e) => handlePreferenciaChange("habitacion", "lejosAscensor", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Vista al exterior</p>
                            <p className="text-sm text-gray-500">Prefiero habitaciones con vista</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.habitacion.vistaExterior}
                          onChange={(e) => handlePreferenciaChange("habitacion", "vistaExterior", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Sección Servicios */}
                {seccionActiva === "servicios" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Coffee className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Desayuno en habitación</p>
                            <p className="text-sm text-gray-500">Servicio de desayuno incluido</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.desayunoEnHabitacion}
                          onChange={(e) => handlePreferenciaChange("servicios", "desayunoEnHabitacion", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Utensils className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Servicio de lavandería</p>
                            <p className="text-sm text-gray-500">Lavado y planchado de ropa</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.servicioLavanderia}
                          onChange={(e) => handlePreferenciaChange("servicios", "servicioLavanderia", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Acceso a gimnasio</p>
                            <p className="text-sm text-gray-500">Uso de instalaciones deportivas</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.accesoGimnasio}
                          onChange={(e) => handlePreferenciaChange("servicios", "accesoGimnasio", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Snowflake className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Acceso a spa</p>
                            <p className="text-sm text-gray-500">Servicios de relajación y bienestar</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.accesoSpa}
                          onChange={(e) => handlePreferenciaChange("servicios", "accesoSpa", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Car className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Estacionamiento</p>
                            <p className="text-sm text-gray-500">Espacio de parking reservado</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.estacionamiento}
                          onChange={(e) => handlePreferenciaChange("servicios", "estacionamiento", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div className="flex items-center gap-3">
                          <Wifi className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">WiFi Premium</p>
                            <p className="text-sm text-gray-500">Internet de alta velocidad</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.servicios.wifiPremium}
                          onChange={(e) => handlePreferenciaChange("servicios", "wifiPremium", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Sección Preferencias Especiales */}
                {seccionActiva === "preferenciasEspeciales" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alergias Alimentarias
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Ej: Alergia a mariscos, frutos secos..."
                        value={preferencias.preferenciasEspeciales.alergias}
                        onChange={(e) => handlePreferenciaChange("preferenciasEspeciales", "alergias", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Restricciones Alimentarias
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={preferencias.preferenciasEspeciales.restriccionesAlimentarias}
                        onChange={(e) => handlePreferenciaChange("preferenciasEspeciales", "restriccionesAlimentarias", e.target.value)}
                      >
                        <option value="">Ninguna</option>
                        <option value="Vegetariano">Vegetariano</option>
                        <option value="Vegano">Vegano</option>
                        <option value="Sin gluten">Sin gluten</option>
                        <option value="Sin lactosa">Sin lactosa</option>
                        <option value="Kosher">Kosher</option>
                        <option value="Halal">Halal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Necesidades Especiales
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Ej: Accesibilidad, equipamiento médico..."
                        value={preferencias.preferenciasEspeciales.necesidadesEspeciales}
                        onChange={(e) => handlePreferenciaChange("preferenciasEspeciales", "necesidadesEspeciales", e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Viajo con mascotas</p>
                          <p className="text-sm text-gray-500">Necesito alojamiento pet-friendly</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.preferenciasEspeciales.mascotas}
                          onChange={(e) => handlePreferenciaChange("preferenciasEspeciales", "mascotas", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Soy fumador</p>
                          <p className="text-sm text-gray-500">Prefiero habitaciones para fumadores</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.preferenciasEspeciales.fumador}
                          onChange={(e) => handlePreferenciaChange("preferenciasEspeciales", "fumador", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Sección Datos de Contacto - MEJORADA */}
                {seccionActiva === "datosContacto" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono Móvil *
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.datosContacto.telefonoMovil}
                          onChange={(e) => handlePreferenciaChange("datosContacto", "telefonoMovil", e.target.value)}
                          placeholder="+54 11 1234-5678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono de Trabajo
                        </label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.datosContacto.telefonoTrabajo}
                          onChange={(e) => handlePreferenciaChange("datosContacto", "telefonoTrabajo", e.target.value)}
                          placeholder="+54 11 4321-5678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Secundario
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={preferencias.datosContacto.emailSecundario}
                        onChange={(e) => handlePreferenciaChange("datosContacto", "emailSecundario", e.target.value)}
                        placeholder="backup@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección Completa
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                        value={preferencias.datosContacto.direccion}
                        onChange={(e) => handlePreferenciaChange("datosContacto", "direccion", e.target.value)}
                        placeholder="Av. Corrientes 1234"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ciudad
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.datosContacto.ciudad}
                          onChange={(e) => handlePreferenciaChange("datosContacto", "ciudad", e.target.value)}
                          placeholder="Buenos Aires"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Código Postal
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.datosContacto.codigoPostal}
                          onChange={(e) => handlePreferenciaChange("datosContacto", "codigoPostal", e.target.value)}
                          placeholder="C1043"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          País
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                          value={preferencias.datosContacto.pais}
                          onChange={(e) => handlePreferenciaChange("datosContacto", "pais", e.target.value)}
                          placeholder="Argentina"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 mt-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Información de contacto</p>
                          <p className="text-sm text-blue-700">
                            Usaremos esta información para contactarte sobre tus reservas y ofertas personalizadas.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sección Privacidad - MEJORADA */}
                {seccionActiva === "privacidad" && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Visibilidad del Perfil</h3>
                      
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Perfil público</p>
                          <p className="text-sm text-gray-500">Mostrar mi perfil en la comunidad de huéspedes</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.perfilPublico}
                          onChange={(e) => handlePreferenciaChange("privacidad", "perfilPublico", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Mostrar mis estadías</p>
                          <p className="text-sm text-gray-500">Compartir historial de estadías en mi perfil</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.mostrarEstadias}
                          onChange={(e) => handlePreferenciaChange("privacidad", "mostrarEstadias", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Mostrar email en perfil</p>
                          <p className="text-sm text-gray-500">Permitir que otros huéspedes vean mi email</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.mostrarEmail}
                          onChange={(e) => handlePreferenciaChange("privacidad", "mostrarEmail", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Mostrar teléfono en perfil</p>
                          <p className="text-sm text-gray-500">Permitir que otros huéspedes vean mi teléfono</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.mostrarTelefono}
                          onChange={(e) => handlePreferenciaChange("privacidad", "mostrarTelefono", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Compartir Datos</h3>
                      
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Compartir datos con socios</p>
                          <p className="text-sm text-gray-500">Permitir que socios estratégicos me contacten</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.compartirDatosSocios}
                          onChange={(e) => handlePreferenciaChange("privacidad", "compartirDatosSocios", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Recibir publicidad</p>
                          <p className="text-sm text-gray-500">Permitir envío de material publicitario</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.recibirPublicidad}
                          onChange={(e) => handlePreferenciaChange("privacidad", "recibirPublicidad", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Preferencias de Navegación</h3>
                      
                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Guardar historial de navegación</p>
                          <p className="text-sm text-gray-500">Recordar mis búsquedas y preferencias</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.historialNavegacion}
                          onChange={(e) => handlePreferenciaChange("privacidad", "historialNavegacion", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                        <div>
                          <p className="font-medium text-gray-900">Cookies personalizadas</p>
                          <p className="text-sm text-gray-500">Permitir cookies para una experiencia personalizada</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={preferencias.privacidad.cookiesPersonalizadas}
                          onChange={(e) => handlePreferenciaChange("privacidad", "cookiesPersonalizadas", e.target.checked)}
                          className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                        />
                      </label>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 mt-6">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-amber-600" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">Control de privacidad</p>
                          <p className="text-sm text-amber-700">
                            Tus datos están protegidos según nuestra política de privacidad. 
                            Puedes actualizar estas preferencias en cualquier momento.
                          </p>
                        </div>
                      </div>
                    </div>
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