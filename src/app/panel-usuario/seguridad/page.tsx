'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Save,
  Shield,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Smartphone,
  Laptop,
  LogOut,
  Key,
  UserCheck,
  Bell
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO"
}

type ConfiguracionSeguridad = {
  autenticacionDosFactores: boolean
  notificacionesLogin: boolean
  sesionesActivas: boolean
  requerirReautenticacion: boolean
}

type DispositivoConectado = {
  id: string
  nombre: string
  tipo: "movil" | "tablet" | "desktop" | "laptop"
  ubicacion: string
  ultimoAcceso: string
  direccionIp: string
  navegador: string
  activo: boolean
}

type ActividadReciente = {
  id: string
  tipo: "login" | "logout" | "cambio_password" | "verificacion_2fa"
  dispositivo: string
  ubicacion: string
  direccionIp: string
  fecha: string
  hora: string
  estado: "exitoso" | "fallido" | "sospechoso"
}

const configuracionSeguridadInicial: ConfiguracionSeguridad = {
  autenticacionDosFactores: false,
  notificacionesLogin: true,
  sesionesActivas: true,
  requerirReautenticacion: false
}

const dispositivosConectados: DispositivoConectado[] = [
  {
    id: "1",
    nombre: "iPhone 13 Pro",
    tipo: "movil",
    ubicacion: "Buenos Aires, AR",
    ultimoAcceso: "Hace 2 minutos",
    direccionIp: "190.123.456.78",
    navegador: "Safari Mobile",
    activo: true
  },
  {
    id: "2",
    nombre: "MacBook Pro",
    tipo: "laptop",
    ubicacion: "Buenos Aires, AR",
    ultimoAcceso: "Hace 1 hora",
    direccionIp: "190.123.456.79",
    navegador: "Chrome 119",
    activo: false
  },
  {
    id: "3",
    nombre: "iPad Air",
    tipo: "tablet",
    ubicacion: "Córdoba, AR",
    ultimoAcceso: "Hace 3 días",
    direccionIp: "190.123.456.80",
    navegador: "Safari Tablet",
    activo: false
  }
]

const actividadesRecientes: ActividadReciente[] = [
  {
    id: "1",
    tipo: "login",
    dispositivo: "iPhone 13 Pro",
    ubicacion: "Buenos Aires, AR",
    direccionIp: "190.123.456.78",
    fecha: "15 Nov 2025",
    hora: "14:23",
    estado: "exitoso"
  },
  {
    id: "2",
    tipo: "verificacion_2fa",
    dispositivo: "iPhone 13 Pro",
    ubicacion: "Buenos Aires, AR",
    direccionIp: "190.123.456.78",
    fecha: "15 Nov 2025",
    hora: "14:22",
    estado: "exitoso"
  },
  {
    id: "3",
    tipo: "login",
    dispositivo: "MacBook Pro",
    ubicacion: "Buenos Aires, AR",
    direccionIp: "190.123.456.79",
    fecha: "14 Nov 2025",
    hora: "16:45",
    estado: "exitoso"
  },
  {
    id: "4",
    tipo: "login",
    dispositivo: "Dispositivo desconocido",
    ubicacion: "Madrid, ES",
    direccionIp: "85.123.456.12",
    fecha: "12 Nov 2025",
    hora: "09:15",
    estado: "fallido"
  },
  {
    id: "5",
    tipo: "cambio_password",
    dispositivo: "MacBook Pro",
    ubicacion: "Buenos Aires, AR",
    direccionIp: "190.123.456.79",
    fecha: "10 Nov 2025",
    hora: "11:30",
    estado: "exitoso"
  }
]

export default function SeguridadCuenta() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [configuracion, setConfiguracion] = useState<ConfiguracionSeguridad>(configuracionSeguridadInicial)
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false)
  const [cambiandoPassword, setCambiandoPassword] = useState(false)
  const [mostrarPasswordActual, setMostrarPasswordActual] = useState(false)
  const [mostrarNuevoPassword, setMostrarNuevoPassword] = useState(false)
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false)

  const [formPassword, setFormPassword] = useState({
    passwordActual: "",
    nuevoPassword: "",
    confirmarPassword: ""
  })

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      setUserSession(JSON.parse(session))
    }

    // Cargar configuración de seguridad guardada
    const configGuardada = localStorage.getItem("configuracionSeguridad")
    if (configGuardada) {
      setConfiguracion(JSON.parse(configGuardada))
    }
  }, [])

  const handleConfigChange = (campo: keyof ConfiguracionSeguridad, valor: boolean) => {
    setConfiguracion(prev => ({
      ...prev,
      [campo]: valor
    }))
    setCambiosSinGuardar(true)
  }

  const handlePasswordChange = (campo: string, valor: string) => {
    setFormPassword(prev => ({
      ...prev,
      [campo]: valor
    }))
  }

  const guardarConfiguracion = () => {
    // Simular guardado en API
    localStorage.setItem("configuracionSeguridad", JSON.stringify(configuracion))
    setCambiosSinGuardar(false)
    setMostrarConfirmacion(true)
    
    setTimeout(() => {
      setMostrarConfirmacion(false)
    }, 3000)
  }

  const cambiarPassword = () => {
    if (formPassword.nuevoPassword !== formPassword.confirmarPassword) {
      alert("Los passwords no coinciden")
      return
    }

    if (formPassword.nuevoPassword.length < 8) {
      alert("El password debe tener al menos 8 caracteres")
      return
    }

    setCambiandoPassword(true)
    
    // Simular cambio de password
    setTimeout(() => {
      setCambiandoPassword(false)
      setFormPassword({
        passwordActual: "",
        nuevoPassword: "",
        confirmarPassword: ""
      })
      alert("Password cambiado exitosamente")
    }, 1500)
  }

  const cerrarSesionDispositivo = (dispositivoId: string) => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión en este dispositivo?")) {
      alert(`Sesión cerrada en el dispositivo ${dispositivoId}`)
    }
  }

  const getIconoDispositivo = (tipo: string) => {
    switch (tipo) {
      case "movil":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Smartphone className="h-5 w-5" />
      case "desktop":
        return <Laptop className="h-5 w-5" />
      case "laptop":
        return <Laptop className="h-5 w-5" />
      default:
        return <Laptop className="h-5 w-5" />
    }
  }

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case "exitoso":
        return "text-emerald-600 bg-emerald-50"
      case "fallido":
        return "text-red-600 bg-red-50"
      case "sospechoso":
        return "text-amber-600 bg-amber-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case "exitoso":
        return <CheckCircle className="h-4 w-4" />
      case "fallido":
        return <XCircle className="h-4 w-4" />
      case "sospechoso":
        return <Shield className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTipoActividad = (tipo: string) => {
    switch (tipo) {
      case "login":
        return "Inicio de sesión"
      case "logout":
        return "Cierre de sesión"
      case "cambio_password":
        return "Cambio de contraseña"
      case "verificacion_2fa":
        return "Verificación 2FA"
      default:
        return tipo
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
              href="/panel-usuario"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver al panel
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">Seguridad de la Cuenta</h1>
              <p className="text-gray-600">Activa verificaciones y revisa accesos recientes</p>
            </div>
            <button
              onClick={guardarConfiguracion}
              disabled={!cambiosSinGuardar}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              Guardar Cambios
            </button>
          </div>

          {/* Confirmación de guardado */}
          {mostrarConfirmacion && (
            <div className="fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Configuración guardada exitosamente
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Configuración de seguridad */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900">Configuración de Seguridad</h2>
                </div>

                <div className="space-y-6">
                  {/* Autenticación de dos factores */}
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Autenticación de dos factores</p>
                        <p className="text-sm text-gray-500">
                          Añade una capa extra de seguridad a tu cuenta
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.autenticacionDosFactores}
                        onChange={(e) => handleConfigChange("autenticacionDosFactores", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  {/* Notificaciones de login */}
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Bell className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Notificaciones de inicio de sesión</p>
                        <p className="text-sm text-gray-500">
                          Recibe alertas cuando alguien acceda a tu cuenta
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.notificacionesLogin}
                        onChange={(e) => handleConfigChange("notificacionesLogin", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {/* Control de sesiones activas */}
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Laptop className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Control de sesiones activas</p>
                        <p className="text-sm text-gray-500">
                          Gestiona y monitorea tus dispositivos conectados
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.sesionesActivas}
                        onChange={(e) => handleConfigChange("sesionesActivas", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {/* Reautenticación requerida */}
                  <div className="flex items-center justify-between p-6 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Reautenticación para cambios sensibles</p>
                        <p className="text-sm text-gray-500">
                          Requiere verificación adicional para modificar datos críticos
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.requerirReautenticacion}
                        onChange={(e) => handleConfigChange("requerirReautenticacion", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actividad reciente */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                  </div>
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Ver todo el historial
                  </button>
                </div>

                <div className="space-y-4">
                  {actividadesRecientes.map((actividad) => (
                    <div key={actividad.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getColorEstado(actividad.estado)}`}>
                          {getIconoEstado(actividad.estado)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{getTipoActividad(actividad.tipo)}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                            <span>{actividad.dispositivo}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {actividad.ubicacion}
                            </span>
                            <span>•</span>
                            <span>{actividad.direccionIp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{actividad.fecha}</p>
                        <p className="text-sm text-gray-500">{actividad.hora}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna lateral */}
            <div className="space-y-8">
              {/* Cambiar contraseña */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Key className="h-6 w-6 text-gray-400" />
                  <h2 className="text-xl font-semibold text-gray-900">Cambiar Contraseña</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarPasswordActual ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        value={formPassword.passwordActual}
                        onChange={(e) => handlePasswordChange("passwordActual", e.target.value)}
                        placeholder="Ingresa tu contraseña actual"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setMostrarPasswordActual(!mostrarPasswordActual)}
                      >
                        {mostrarPasswordActual ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarNuevoPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        value={formPassword.nuevoPassword}
                        onChange={(e) => handlePasswordChange("nuevoPassword", e.target.value)}
                        placeholder="Mínimo 8 caracteres"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setMostrarNuevoPassword(!mostrarNuevoPassword)}
                      >
                        {mostrarNuevoPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nueva Contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={mostrarConfirmarPassword ? "text" : "password"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent pr-12"
                        value={formPassword.confirmarPassword}
                        onChange={(e) => handlePasswordChange("confirmarPassword", e.target.value)}
                        placeholder="Repite la nueva contraseña"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                      >
                        {mostrarConfirmarPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={cambiarPassword}
                    disabled={cambiandoPassword || !formPassword.passwordActual || !formPassword.nuevoPassword || !formPassword.confirmarPassword}
                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-black/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {cambiandoPassword ? "Cambiando..." : "Cambiar Contraseña"}
                  </button>
                </div>
              </div>

              {/* Dispositivos conectados */}
              <div className="bg-white rounded-3xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-6 w-6 text-gray-400" />
                    <h2 className="text-xl font-semibold text-gray-900">Dispositivos Conectados</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {dispositivosConectados.filter(d => d.activo).length} activos
                  </span>
                </div>

                <div className="space-y-4">
                  {dispositivosConectados.map((dispositivo) => (
                    <div key={dispositivo.id} className="p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getIconoDispositivo(dispositivo.tipo)}
                          <div>
                            <p className="font-medium text-gray-900">{dispositivo.nombre}</p>
                            <p className="text-sm text-gray-500">{dispositivo.navegador}</p>
                          </div>
                        </div>
                        {dispositivo.activo && (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            Activo
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{dispositivo.ubicacion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>{dispositivo.ultimoAcceso}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          <span>{dispositivo.direccionIp}</span>
                        </div>
                      </div>

                      {!dispositivo.activo && (
                        <button
                          onClick={() => cerrarSesionDispositivo(dispositivo.id)}
                          className="w-full mt-3 text-red-600 hover:text-red-700 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Cerrar sesión en este dispositivo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Consejos de seguridad */}
              <div className="bg-blue-50 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Consejos de Seguridad</h3>
                </div>
                <ul className="space-y-3 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Usa una contraseña única y segura</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Activa la autenticación de dos factores</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Revisa regularmente tu actividad de cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Cierra sesión en dispositivos públicos</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}