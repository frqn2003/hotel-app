'use client'
import Link from 'next/link'
import Boton from './ui/Boton'
import Icono from './ui/Icono'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
    const [menuAbierto, setMenuAbierto] = useState(false)

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto)
        const menu = document.getElementById('navbar-menu')
        if (menu) {
            if (!menuAbierto) {
                menu.classList.add('menu-open')
            } else {
                menu.classList.remove('menu-open')
            }   
        }
    }

    const cerrarMenu = () => {
        setMenuAbierto(false)
        const menu = document.getElementById('navbar-menu')
        if (menu) {
            menu.classList.remove('menu-open')
        }
    }
    
    return (
        <nav className="top-0 sticky bg-[#DBF8FA]/90 w-full z-50 backdrop-blur-lg flex border-b-2 border-gray-200 gap-2 md:gap-4 py-4 font-sans">
            <div className='flex items-center gap-2 md:gap-4 w-full contenedor'>
                <Icono nombre="NextLujos"/>
                <div className='hidden md:flex md:justify-start md:items-center w-full' id='desktop-navbar'>
                    <div className='gap-2 md:gap-4 flex justify-start items-start text-[15px] font-sans'>
                        <Link href="#habitaciones" className='text-gray-800 hover:text-black transition-all'>Habitaciones</Link>
                        <Link href="#reservas" className='text-gray-800 hover:text-black transition-all'>Reservas</Link>
                        <Link href="#Nosotros" className='text-gray-800 hover:text-black transition-all'>Nosotros</Link>
                        <Link href="#contacto" className='text-gray-800 hover:text-black transition-all'>Contacto</Link>
                    </div>
                    <div className='flex gap-2 md:gap-4 items-center justify-end w-full'>
                        <Link href="/login">
                            <Boton texto="Iniciar Sesión" bgColor="bg-gray-200 hover:bg-gray-200/70" textColor="text-black" />
                        </Link>
                        <Link href="/reserva">
                            <Boton texto="Reservar" bgColor="bg-black hover:bg-black/90" textColor="text-white" />
                        </Link>
                    </div>
                </div>
            </div>
            <div className='md:hidden flex justify-end items-center w-full contenedor'>
                <div className='flex gap-2 md:gap-4 items-center justify-end w-full'>
                    <button id='menu-button' onClick={toggleMenu} className='p-2 hover:bg-gray-100 rounded-lg transition-all'>
                        {menuAbierto ? (
                            <X className='h-6 w-6 text-black' />
                        ) : (
                            <Menu className='h-6 w-6 text-black' />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú móvil desplegable */}
            <div id='navbar-menu' className='md:hidden absolute top-full left-0 w-full bg-white/90 border-b-2 border-gray-200 shadow-lg z-40 backdrop-blur-lg overflow-hidden'>
                    <div className='flex flex-col gap-4 py-6 contenedor'>
                        <div className='grid grid-cols-2 gap-2 md:gap-4 items-center justify-center'>
                            <Link href="#habitaciones" className='text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex bg-gray-100 rounded-lg' onClick={cerrarMenu} > Habitaciones </Link>
                            <Link href="#reservas" className='text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex bg-gray-100 rounded-lg' onClick={cerrarMenu} > Reservas </Link>
                            <Link href="#Nosotros" className='text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex bg-gray-100 rounded-lg' onClick={cerrarMenu}> Nosotros </Link>
                            <Link href="#contacto" className='text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex bg-gray-100 rounded-lg' onClick={cerrarMenu}>Contacto</Link>
                        </div>
                        <div className='flex flex-row gap-3 pt-4 border-t border-gray-200 justify-center'>
                            <Link href="/login" onClick={cerrarMenu}>
                                <Boton texto="Iniciar Sesión" bgColor="bg-gray-200 hover:bg-gray-200/70" textColor="text-black" />
                            </Link>
                            <Link href="/reserva" className='justify-end flex' onClick={cerrarMenu}>
                                <Boton texto="Reservar" bgColor="bg-black hover:bg-black/90" textColor="text-white" />
                            </Link>
                        </div>
                    </div>
            </div>
        </nav>
    )
}