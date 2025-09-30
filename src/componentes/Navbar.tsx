import Link from 'next/link'

export default function Navbar(){
    return(
        <nav className="top fixed bg-white w-full z-50 backdrop-blur-lg flex border-b-2 border-gray-200 px-2 gap-4 py-4 m-auto">
            <Link className='text-gray-700 hover:text-gray-900 text-sm' href="#home">Home</Link>
            <Link className='text-gray-700 hover:text-gray-900 text-sm' href="#reservas">Reservas</Link>
            <Link className='text-gray-700 hover:text-gray-900 text-sm' href="#contacto">Contacto</Link>
            <div className='flex gap-2 justify-end absolute px-2 right-0'>
                <button className=''>Iniciar Sesión</button>
                <Link className='' href="#reserva">Reservar Ahora</Link>
            </div>
        </nav>
    )
}