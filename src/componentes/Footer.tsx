import Icono from "./ui/Icono"
import { MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="contenedor bottom-0 py-6 space-y-2 border-b-2 border-gray-300 my-6 flex flex-col md:flex-row justify-between">
                <div className="flex flex-col space-y-4">
                    <Icono />
                    <span className="text-gray-500 text-sm">© 2025 NextLujos. Todos los derechos reservados.
                    </span>
                    <div className="flex flex-row gap-2 md:gap-4 justify-start items-center">
                        <div className="text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-facebook-icon lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        </div>
                        <div className="text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-instagram-icon lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </div>
                        <div className="text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                            </svg>
                        </div>
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