import Icono from "./ui/Icono"
import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react"
import { Twitter } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="contenedor bottom-0 py-6 space-y-2 border-b-2 border-gray-300 my-6 flex flex-col md:flex-row justify-between">
                <div className="flex flex-col space-y-4">
                    <Icono nombre="NextLujos"/>
                    <span className="text-gray-500 text-sm">© 2025 NextLujos. Todos los derechos reservados.
                    </span>
                    <div className="flex flex-row gap-2 md:gap-4 justify-start items-center">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                           className="text-gray-600 hover:text-blue-600 transition-colors">
                            <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                           className="text-gray-600 hover:text-pink-600 transition-colors">
                            <Instagram className="w-6 h-6" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                           className="text-gray-600 hover:text-black transition-colors">
                            <Twitter className="w-6 h-6" />
                        </a>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">
                    <h2 className="text-lg font-bold">Contacto</h2>
                    <div className="flex flex-col space-y-3">
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 text-sm">
                                Av. Corrientes 1234, CABA,<br />Buenos Aires, Argentina
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <a href="tel:+541112345678" className="text-gray-600 text-sm hover:text-black transition-colors">
                                +54 11 1234-5678
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <a href="mailto:contacto@nextlujos.com" className="text-gray-600 text-sm hover:text-black transition-colors">
                                contacto@nextlujos.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}