import Boton from "@/componentes/ui/Boton"
import Link from "next/link"
import { Badge } from "lucide-react";
interface HabitacionesCardProps {
    titulo: string;
    descripcion: string;
    precio: number;
    imagen?: string;
    caracteristicas?: string[];
}

export default function HabitacionesCard({ titulo, descripcion, precio, imagen, caracteristicas }: HabitacionesCardProps) {
    return (
        <div className="flex flex-col justify-center border-2 border-gray-300/90 shadow-2xl p-4 rounded-md space-y-5 font-[family-name:var(--font-geist-sans)]">
            <div className="h-full w-full overflow-hidden relative">
                <img src={imagen || "https://placehold.co/600x400"} alt={titulo} className="hover:scale-110 transition-all duration-300 object-cover object-center" />
                <div className="top-4 right-4 absolute bg-black text-white px-2 py-1 rounded-md">
                    <span className="text-sm font-semibold">
                        ${precio}/noche
                    </span>
                </div>
            </div>
            <div className="flex flex-col justify-center pt-6">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-black text-left">{titulo}</h3>
                <span className="text-gray-500 text-base pt-2">{descripcion}</span>
            </div>
            <ul className="flex flex-row gap-2 pb-6">
                {caracteristicas?.map((caracteristica, index) => (
                    <li className="text-black text-sm bg-gray-300 rounded-lg px-3 py-1" key={index}>{caracteristica}</li>
                ))}
            </ul>
            <Link href="/reserva" className="w-full">
                <Boton texto="Reservar" bgColor="bg-black hover:bg-black/90 w-full" textColor="text-white" />
            </Link>
        </div>
    )
}