import { Suspense } from 'react'
import PersonalizarReservaContent from '@/app/personalizar-reserva/personalizar-content'
import Navbar from '@/componentes/Navbar'
import Footer from '@/componentes/Footer'

export default function PersonalizarReserva() {
    return (
        <>
            <Navbar onSubPage={true} />
            <Suspense fallback={
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando habitación...</p>
                    </div>
                </main>
            }>
                <PersonalizarReservaContent />
            </Suspense>
            <Footer />
        </>
    )
}
