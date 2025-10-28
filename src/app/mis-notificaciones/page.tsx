'use client'

import { useEffect, useState } from 'react'
import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import ListaNotificaciones from "@/componentes/Notificaciones/ListaNotificaciones"

export default function MisNotificacionesPage() {
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Obtener userId del localStorage
    const session = localStorage.getItem("userSession")
    if (session) {
      const userData = JSON.parse(session)
      setUserId(userData.id)
    }
  }, [])

  if (!userId) {
    return (
      <>
        <Navbar onSubPage />
        <main className="bg-[#F3F6FA] py-16 min-h-screen">
          <div className="contenedor flex items-center justify-center">
            <p className="text-gray-600">Cargando...</p>
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
          <ListaNotificaciones userId={userId} />
        </div>
      </main>
      <Footer />
    </>
  )
}
