'use client'

import { useEffect, useState } from "react"
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Mail,
  Phone,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Loader
} from "lucide-react"

type UserSession = {
  nombre: string
  correo: string
  rol: "OPERADOR" | "USUARIO" | "ADMIN"
}

type Operador = {
  id: string
  nombre: string
  email: string
  telefono?: string
  rol: string
  estado: "activo" | "inactivo"
  createdAt: string
  consultasRespondidas?: number
}

type FormData = {
  nombre: string
  email: string
  telefono: string
  password: string
}

export default function OperadoresPage() {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterEstado, setFilterEstado] = useState<"todos" | "activo" | "inactivo">("todos")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      if (userData.rol !== "ADMINISTRADOR" && userData.rol !== "OPERADOR") {
        window.location.href = "/panel-usuario"
        return
      }
      setUserSession(userData)
    }
    fetchOperadores()
  }, [])

  const fetchOperadores = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/operadores")
      if (!res.ok) throw new Error("Error al cargar operadores")
      const data = await res.json()
      setOperadores(data)
    } catch (err) {
      setError("Error al cargar los operadores")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!formData.nombre || !formData.email) {
      setError("Nombre y email son requeridos")
      return
    }

    if (!editingId && !formData.password) {
      setError("Contraseña es requerida para nuevos operadores")
      return
    }

    try {
      setSubmitting(true)
      const method = editingId ? "PUT" : "POST"
      const url = editingId ? `/api/operadores/${editingId}` : "/api/operadores"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al guardar operador")
      }

      setSuccess(editingId ? "Operador actualizado correctamente" : "Operador creado correctamente")
      setFormData({ nombre: "", email: "", telefono: "", password: "" })
      setEditingId(null)
      setShowModal(false)
      fetchOperadores()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar operador")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (operador: Operador) => {
    setFormData({
      nombre: operador.nombre,
      email: operador.email,
      telefono: operador.telefono || "",
      password: ""
    })
    setEditingId(operador.id)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este operador?")) return

    try {
      const res = await fetch(`/api/operadores/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar operador")
      setSuccess("Operador eliminado correctamente")
      fetchOperadores()
    } catch (err) {
      setError("Error al eliminar operador")
      console.error(err)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ nombre: "", email: "", telefono: "", password: "" })
    setError("")
  }

  const filteredOperadores = operadores.filter(op => {
    const matchesSearch = op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterEstado === "todos" || op.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16">
        <div className="contenedor flex flex-col gap-8">
          {/* Header */}
          <section className="bg-white shadow-xl rounded-3xl px-8 py-10 flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm uppercase tracking-widest text-gray-500">
                  Gestión de Operadores
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
                  Operadores del Hotel
                </h1>
                <p className="text-base text-gray-600 max-w-2xl">
                  Gestiona el equipo de operadores y sus permisos
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded-xl shadow-md hover:bg-black/90 transition-all"
              >
                <Plus className="h-4 w-4" />
                Nuevo Operador
              </button>
            </div>

            {/* Búsqueda y filtros */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value as any)}
                  className="pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white cursor-pointer"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                </select>
              </div>
            </div>

            {/* Mensajes */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-emerald-800">{success}</p>
              </div>
            )}
          </section>

          {/* Tabla de operadores */}
          <section className="bg-white border border-gray-100 rounded-3xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : filteredOperadores.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <AlertCircle className="h-8 w-8 text-gray-300" />
                <p className="text-gray-500">No hay operadores para mostrar</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nombre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Teléfono</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Estado</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Consultas</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOperadores.map((operador) => (
                      <tr key={operador.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{operador.nombre}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">{operador.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {operador.telefono ? (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">{operador.telefono}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                              operador.estado === "activo"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            <span className={`h-2 w-2 rounded-full ${operador.estado === "activo" ? "bg-emerald-600" : "bg-gray-400"}`}></span>
                            {operador.estado === "activo" ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-gray-900">{operador.consultasRespondidas || 0}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(operador)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="h-4 w-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(operador.id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900">
                {editingId ? "Editar Operador" : "Nuevo Operador"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Nombre del operador"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="email@hotel.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="+56 9 1234 5678"
                />
              </div>

              {!editingId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="••••••••"
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
