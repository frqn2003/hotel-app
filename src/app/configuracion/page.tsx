'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'
import { User, Mail, Lock, CreditCard, Bell, Save, Eye, EyeOff, CheckCircle } from 'lucide-react'

type UserSession = {
  id: string
  nombre: string
  correo: string
  telefono?: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

export default function Configuracion() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [guardado, setGuardado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mostrarPassword, setMostrarPassword] = useState(false)

  // Datos del perfil
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')

  // Cambio de contraseña
  const [passwordActual, setPasswordActual] = useState('')
  const [passwordNueva, setPasswordNueva] = useState('')
  const [passwordConfirmar, setPasswordConfirmar] = useState('')

  // Método de pago
  const [metodoPago, setMetodoPago] = useState('TARJETA_CREDITO')
  const [numeroTarjeta, setNumeroTarjeta] = useState('')

  // Preferencias
  const [notificacionesEmail, setNotificacionesEmail] = useState(true)
  const [notificacionesPromociones, setNotificacionesPromociones] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      setUserSession(userData)
      setNombre(userData.nombre || '')
      setEmail(userData.correo || '')
      setTelefono(userData.telefono || '')
    }
  }, [])

  const guardarPerfil = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/usuarios/${userSession?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, telefono })
      })

      const data = await response.json()

      if (data.success) {
        // Actualizar localStorage
        const updatedSession = { ...userSession, nombre, correo: email, telefono }
        localStorage.setItem('userSession', JSON.stringify(updatedSession))
        setUserSession(updatedSession as UserSession)
        
        setGuardado(true)
        setTimeout(() => setGuardado(false), 3000)
      } else {
        setError(data.message || 'Error al actualizar perfil')
      }
    } catch (err) {
      setError('Error al guardar los cambios')
    } finally {
      setLoading(false)
    }
  }

  const cambiarPassword = async () => {
    try {
      setLoading(true)
      setError(null)

      if (passwordNueva !== passwordConfirmar) {
        setError('Las contraseñas no coinciden')
        setLoading(false)
        return
      }

      if (passwordNueva.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres')
        setLoading(false)
        return
      }

      const response = await fetch(`/api/usuarios/${userSession?.id}/cambiar-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          passwordActual, 
          passwordNueva 
        })
      })

      const data = await response.json()

      if (data.success) {
        setGuardado(true)
        setPasswordActual('')
        setPasswordNueva('')
        setPasswordConfirmar('')
        setTimeout(() => setGuardado(false), 3000)
      } else {
        setError(data.message || 'Error al cambiar contraseña')
      }
    } catch (err) {
      setError('Error al cambiar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] min-h-screen py-16">
        <div className="contenedor max-w-4xl mx-auto flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Configuración de Cuenta
            </h1>
            <p className="text-base text-gray-600 mt-2">
              Administra tu información personal y preferencias
            </p>
          </section>

          {/* Mensajes */}
          {guardado && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <p className="text-emerald-700 font-medium">Cambios guardados exitosamente</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Información Personal */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Información Personal</h2>
                <p className="text-sm text-gray-500">Actualiza tus datos personales</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <button
                onClick={guardarPerfil}
                disabled={loading}
                className="w-full bg-black text-white py-3 px-6 rounded-xl font-semibold hover:bg-black/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </section>

          {/* Seguridad - Cambiar Contraseña */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Seguridad</h2>
                <p className="text-sm text-gray-500">Cambia tu contraseña</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña actual
                </label>
                <div className="relative">
                  <input
                    type={mostrarPassword ? "text" : "password"}
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {mostrarPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={passwordNueva}
                  onChange={(e) => setPasswordNueva(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  value={passwordConfirmar}
                  onChange={(e) => setPasswordConfirmar(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              <button
                onClick={cambiarPassword}
                disabled={loading || !passwordActual || !passwordNueva || !passwordConfirmar}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock className="h-5 w-5" />
                {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </button>
            </div>
          </section>

          {/* Método de Pago */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Método de Pago</h2>
                <p className="text-sm text-gray-500">Gestiona tu forma de pago preferida</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de pago
                </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                  <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                  <option value="TRANSFERENCIA">Transferencia Bancaria</option>
                  <option value="EFECTIVO">Efectivo</option>
                </select>
              </div>

              {(metodoPago === 'TARJETA_CREDITO' || metodoPago === 'TARJETA_DEBITO') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de tarjeta
                  </label>
                  <input
                    type="text"
                    value={numeroTarjeta}
                    onChange={(e) => setNumeroTarjeta(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="•••• •••• •••• 4242"
                    maxLength={19}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Tu información está protegida y encriptada
                  </p>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Guardar Método de Pago
              </button>
            </div>
          </section>

          {/* Preferencias */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Preferencias</h2>
                <p className="text-sm text-gray-500">Configura tus notificaciones</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <div>
                  <p className="font-medium text-gray-900">Notificaciones por email</p>
                  <p className="text-sm text-gray-500">Recibe actualizaciones sobre tus reservas</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificacionesEmail}
                  onChange={(e) => setNotificacionesEmail(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all">
                <div>
                  <p className="font-medium text-gray-900">Promociones y ofertas</p>
                  <p className="text-sm text-gray-500">Recibe descuentos exclusivos</p>
                </div>
                <input
                  type="checkbox"
                  checked={notificacionesPromociones}
                  onChange={(e) => setNotificacionesPromociones(e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                />
              </label>

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                Guardar Preferencias
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
