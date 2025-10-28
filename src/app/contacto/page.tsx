'use client'

import Navbar from "@/componentes/Navbar"
import Footer from "@/componentes/Footer"
import FormularioContacto from "@/componentes/Contacto/FormularioContacto"

export default function ContactoPage() {
  return (
    <>
      <Navbar onSubPage />
      <main className="bg-[#F3F6FA] py-16 min-h-screen">
        <div className="contenedor">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Contáctanos
              </h1>
              <p className="text-lg text-gray-600">
                ¿Tienes alguna pregunta? Estamos aquí para ayudarte
              </p>
            </div>
            
            <FormularioContacto />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
