import Link from "next/link"
import Boton from "./ui/Boton"
import { ArrowRight } from "lucide-react"

/* CAMBIAR */

export default function BannerPromo() {
    return (
        <section className="bg-gradient-to-r from-gray-900 to-black text-white py-16 md:py-20" id="reservas">
            <div className="contenedor">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                            ¿Listo para tu próxima experiencia?
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300">
                            Reservá ahora y obtené hasta un 20% de descuento en estadías de 3 noches o más
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link href="/reserva">
                            <Boton 
                                texto="Reservar Ahora" 
                                bgColor="bg-white hover:bg-gray-100" 
                                textColor="text-black"
                            />
                        </Link>
                        <Link href="#contacto">
                            <button className="flex items-center gap-2 px-6 py-3 border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all">
                                Contactanos
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
