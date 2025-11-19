'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
  Users,
  MapPin,
  Image as ImageIcon
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMINISTRADOR"
}

export default function CrearHabitacion() {
  const router = useRouter()
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    numero: 0,
    tipo: "",
    precio: 0,
    capacidad: 0,
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
  }, [])

  const handleInputChange = (field: string, value: string | number) => {
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
      setLoading(true)
      setError("")
      setSuccess("")

      // Backend deshabilitado - Simular creación
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setSuccess(`Habitación #${formData.numero} creada exitosamente`)
      
      setTimeout(() => {
        router.push("/panel-admin/habitaciones")
      }, 1500)
    } catch (err) {
      setError("Error al crear habitación")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/panel-admin/habitaciones"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Volver a habitaciones
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-semibold text-gray-900">
                Crear Nueva Habitación
              </h1>
              <p className="text-gray-600">Agrega una nueva habitación al inventario</p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                    className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                      className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
                      min="1"
                      max="10"
                      required
                    />
                    <Users className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
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
                  className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                    className={`px-4 py-3 rounded-xl border font-medium Transition-all text-sm ${
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
                      className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                      className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
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
                      className="w-full px-4 py-3 between border-gray-500 rounded-xl focus:ring-2 focus:ring-the focus:border-transparent"
                      step="0.000001"
                      placeholder="-58.3816"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-4">
              <Link
                href="/panel-admin/habitaciones"
                className="px-6 py-3 between border-gray-500 text-gray-700 rounded-xl font-medium hover:bg-gray-50 Transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 Transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Crear Habitación
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
