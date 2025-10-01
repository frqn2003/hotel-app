import Link from 'next/link'
import Boton from './Boton'

export default function Navbar() {
    return (
        <nav className="top-0 sticky bg-white w-full z-50 backdrop-blur-lg flex border-b-2 border-gray-200 px-12 gap-4 py-4 font-sans">
            <div className='flex items-center gap-4 w-full'>
                <a href="#" className="flex items-center gap-2 justify-between">
                    <span className='h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center text-md font-bold font-sans'>H</span>
                    <div className='text-xl font-bold font-sans'>Hotel</div>
                </a>
                <div className='gap-4 flex justify-start items-start text-[15px] font-sans'>
                    <Link href="#habitaciones" className='text-gray-800 hover:text-black transition-all'>Habitaciones</Link>
                    <Link href="#reservas" className='text-gray-800 hover:text-black transition-all'>Reservas</Link>
                    <Link href="#Nosotros" className='text-gray-800 hover:text-black transition-all'>Nosotros</Link>
                    <Link href="#contacto" className='text-gray-800 hover:text-black transition-all'>Contacto</Link>
                </div>
                <div className='flex gap-4 items-center justify-end w-full'>
                    <Link href="/login">
                        <Boton texto="Iniciar Sesión" bgColor="bg-gray-200 hover:bg-gray-200/70" textColor="text-black"/>
                    </Link>
                    <Link href="/reserva">
                        <Boton texto="Reservar Ahora" bgColor="bg-black hover:bg-black/90" textColor="text-white"/>
                    </Link>
                </div>  
            </div>
        </nav>
    )
}