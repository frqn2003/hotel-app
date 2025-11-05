'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  ArrowLeft,
  Save,
  Loader,
  AlertCircle,
  Bed,
  Wifi,
  Tv,
  Coffee,
  Car,
  Snowflake,
  Wind,
  Users,
  MapPin,
  Image as ImageIcon
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

type Habitacion = {
  id: string
  numero: number
  tipo: string
  precio: number
  capacidad: number
  estado: "DISPONIBLE" | "OCUPADA" | "MANTENIMIENTO" | "LIMPIEZA" | "RESERVADA"
  descripcion?: string
  comodidades?: string[]
  imagen?: string
  lat?: number
  lng?: number
  createdAt: string
  updatedAt: string
}

export default function EditarHabitacion() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [habitacion, setHabitacion] = useState<Habitacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    numero: 0,
    tipo: "",
    precio: 0,
    capacidad: 0,
    estado: "DISPONIBLE" as Habitacion["estado"],
    descripcion: "",
    comodidades: [] as string[],
    imagen: "",
    lat: 0,
    lng: 0
  })

  const tiposHabitacion = [
    "SIMPLE",
    "DOBLE", 
    "SUITE",
    "TRIPLE",
    "PRESIDENCIAL",
    "DOBLE SUPERIOR",
    "SUITE JUNIOR",
    "FAMILIAR"
  ]

  const estadosHabitacion = [
    { value: "DISPONIBLE", label: "Disponible", color: "text-green-600" },
    { value: "OCUPADA", label: "Ocupada", color: "text-blue-600" },
    { value: "RESERVADA", label: "Reservada", color: "text-amber-600" },
    { value: "LIMPIEZA", label: "En Limpieza", color: "text-purple-600" },
    { value: "MANTENIMIENTO", label: "Mantenimiento", color: "text-red-600" }
  ]

  const comodidadesDisponibles = [
    "WiFi", "TV", "Aire Acondicionado", "Baño Privado", "Minibar", "Jacuzzi",
    "Vista al mar", "Balcón", "Cocina", "Sala de reuniones", "Servicio a Habitación",
    "Estacionamiento", "Gimnasio", "Spa", "Piscina", "Restaurante", "Bar",
    "Caja fuerte", "Secador de pelo", "Plancha", "Teléfono", "Refrigerador"
  ]

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR") {
        router.push("/panel-admin")
        return
      }
      setUserSession(userData)
    } else {
      router.push("/auth/login")
      return
    }

    if (id) {
      fetchHabitacion()
    }
  }, [id])

  const fetchHabitacion = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/habitaciones/${id}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError("Habitación no encontrada")
        } else {
          throw new Error("Error al cargar habitación")
        }
        return
      }

      const data = await response.json()
      if (data.success) {
        const habitacionData = data.data
        setHabitacion(habitacionData)
        setFormData({
          numero: habitacionData.numero,
          tipo: habitacionData.tipo,
          precio: habitacionData.precio,
          capacidad: habitacionData.capacidad,
          estado: habitacionData.estado,
          descripcion: habitacionData.descripcion || "",
          comodidades: Array.isArray(habitacionData.comodidades) 
            ? habitacionData.comodidades 
            : (habitacionData.comodidades || "").split(" ").filter(Boolean),
          imagen: habitacionData.imagen || "",
          lat: habitacionData.lat || 0,
          lng: habitacionData.lng || 0
        })
      } else {
        setError(data.error || "Error al cargar habitación")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleComodidad = (comodidad: string) => {
    setFormData(prev => ({
      ...prev,
      comodidades: prev.comodidades.includes(comodidad)
        ? prev.comodidades.filter(c => c !== comodidad)
        : [...prev.comodidades, comodidad]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.numero || !formData.tipo || !formData.precio || !formData.capacidad) {
      setError("Todos los campos obligatorios deben ser completados")
      return
    }

    try {
      setSaving(true)
      setError("")
      setSuccess("")

      const response = await fetch(`/api/habitaciones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (data.success) {
        setSuccess("Habitación actualizada exitosamente")
        setTimeout(() => {
          router.push("/panel-admin/habitaciones")
        }, 2000)
      } else {
        setError(data.error || "Error al actualizar habitación")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] py-16 min-h-screen">
          <div className="contenedor">
            <div className="flex items-center justify-center py-16">
              <Loader className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error && !habitacion) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] py-16 min-h-screen">
          <div className="contenedor">
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <a
              href="/panel-admin/habitaciones"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a habitaciones
            </a>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">
                Editar Habitación #{formData.numero}
              </h1>
              <p className="text-gray-600">Modifica la información y disponibilidad de la habitación</p>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Información básica */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Información Básica
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Habitación *
                  </label>
                  <input
                    type="number"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Habitación *
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => handleInputChange('tipo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un tipo</option>
                    {tiposHabitacion.map(tipo => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio por Noche *
                  </label>
                  <input
                    type="number"
                    value={formData.precio}
                    onChange={(e) => handleInputChange('precio', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.capacidad}
                      onChange={(e) => handleInputChange('capacidad', parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                      min="1"
                      max="10"
                      required
                    />
                    <Users className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Estado - Campo principal para disponibilidad */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado de Disponibilidad *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {estadosHabitacion.map(estado => (
                    <button
                      key={estado.value}
                      type="button"
                      onClick={() => handleInputChange('estado', estado.value)}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                        formData.estado === estado.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {estado.label}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.estado === "DISPONIBLE" && "✅ La habitación está lista para ser reservada"}
                  {formData.estado === "OCUPADA" && "👤 La habitación actualmente tiene huéspedes"}
                  {formData.estado === "RESERVADA" && "📅 La habitación tiene una reserva confirmada"}
                  {formData.estado === "LIMPIEZA" && "🧹 La habitación está en proceso de limpieza"}
                  {formData.estado === "MANTENIMIENTO" && "🔧 La habitación requiere reparaciones"}
                </p>
              </div>

              {/* Descripción */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                  placeholder="Describe las características especiales de la habitación..."
                />
              </div>
            </div>

            {/* Comodidades */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Coffee className="h-5 w-5" />
                Comodidades y Servicios
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {comodidadesDisponibles.map(comodidad => (
                  <button
                    key={comodidad}
                    type="button"
                    onClick={() => toggleComodidad(comodidad)}
                    className={`px-4 py-3 rounded-xl border font-medium transition-all text-sm ${
                      formData.comodidades.includes(comodidad)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {comodidad}
                  </button>
                ))}
              </div>
            </div>

            {/* Ubicación e Imagen */}
            <div className="bg-white rounded-3xl shadow-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ubicación e Imagen
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de Imagen
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.imagen}
                      onChange={(e) => handleInputChange('imagen', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    <ImageIcon className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                  {formData.imagen && (
                    <div className="mt-3">
                      <img 
                        src={formData.imagen} 
                        alt="Vista previa" 
                        className="w-full h-40 object-cover rounded-xl"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/400x200?text=Imagen+no+disponible"
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      value={formData.lat}
                      onChange={(e) => handleInputChange('lat', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                      step="0.000001"
                      placeholder="-34.6037"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      value={formData.lng}
                      onChange={(e) => handleInputChange('lng', parseFloat(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue focus:border-transparent"
                      step="0.000001"
                      placeholder="-58.3816"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-4">
              <a
                href="/panel-admin/habitaciones"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </a>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}
