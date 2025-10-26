'use client'
import Link from 'next/link'
import Boton from './ui/Boton'
import Icono from './ui/Icono'
import { Menu, X, User, PanelBottom } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UserSession {
    nombre: string
    correo: string
    rol: 'OPERADOR' | 'USUARIO' | 'ADMIN'
}

interface NavProps {
    onSubPage?: boolean
    onImportantPage?: boolean
}

export default function Navbar({ onSubPage = false, onImportantPage = false }: NavProps) {
    const [menuAbierto, setMenuAbierto] = useState(false)
    const [perfilAbierto, setPerfilAbierto] = useState(false)
    const [userSession, setUserSession] = useState<UserSession | null>(null)
    const [seccionActiva, setSeccionActiva] = useState('')

    useEffect(() => {
        const session = localStorage.getItem('userSession')
        if (session) {
            setUserSession(JSON.parse(session))
        }
    }, [])

    // Observer para detectar qué sección está visible
    useEffect(() => {
        if (!onImportantPage) return

        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        }

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setSeccionActiva(entry.target.id)
                }
            })
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        // Observar todas las secciones
        const secciones = ['habitaciones', 'reservas', 'Nosotros']
        secciones.forEach((id) => {
            const elemento = document.getElementById(id)
            if (elemento) observer.observe(elemento)
        })

        return () => observer.disconnect()
    }, [onImportantPage])

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

    const togglePerfil = () => {
        setPerfilAbierto(!perfilAbierto)
    }

    const cerrarSesion = () => {
        localStorage.removeItem('userSession')
        localStorage.removeItem('userToken')
        setUserSession(null)
        setPerfilAbierto(false)
        window.location.href = '/'
    }
    return (
        <nav className="top-0 sticky bg-[#DBF8FA]/20 w-full z-50 backdrop-blur-lg flex  gap-2 md:gap-4 py-4 font-sans">
            <div className='flex items-center gap-2 md:gap-4 w-full contenedor'>
                <Icono nombre="NextLujos" />
                <div className='hidden md:flex md:justify-start md:items-center w-full' id='desktop-navbar'>
                    {onSubPage && (
                        <Link href="/" className='text-gray-800 hover:text-black transition-all'>Inicio</Link>
                    )}
                    {onImportantPage && (
                        <div className='gap-2 md:gap-4 flex justify-start items-start text-[15px] font-sans'>
                            <Link 
                                href="#habitaciones" 
                                className={`text-gray-800 hover:text-black transition-all pb-1 border-b-2 ${
                                    seccionActiva === 'habitaciones' ? 'border-black font-semibold' : 'border-transparent'
                                }`}
                            >
                                Habitaciones
                            </Link>
                            <Link 
                                href="#reservas" 
                                className={`text-gray-800 hover:text-black transition-all pb-1 border-b-2 ${
                                    seccionActiva === 'reservas' ? 'border-black font-semibold' : 'border-transparent'
                                }`}
                            >
                                Reservas
                            </Link>
                            <Link 
                                href="#Nosotros" 
                                className={`text-gray-800 hover:text-black transition-all pb-1 border-b-2 ${
                                    seccionActiva === 'Nosotros' ? 'border-black font-semibold' : 'border-transparent'
                                }`}
                            >
                                Nosotros
                            </Link>
                        </div>
                    )}

                    <div className='flex gap-2 md:gap-4 items-center justify-end w-full'>
                        <Link href="/reserva">
                            <Boton texto="Reservar" bgColor="bg-black hover:bg-black/90" textColor="text-white" />
                        </Link>
                        {userSession ? (
                            <div className='relative'>
                                <button
                                    onClick={togglePerfil}
                                    className='bg-black/10 hover:bg-black/20 rounded-lg p-2 cursor-pointer transition-all'
                                >
                                    <User className='h-6 w-6 text-black' />
                                </button>
                                {perfilAbierto && (
                                    <div className='absolute top-full right-0 w-80 mt-2 bg-white border border-gray-200 shadow-lg z-50 rounded-lg overflow-hidden'>
                                        <div className="flex flex-col gap-2 p-4">
                                            <div className="flex flex-col gap-1 pb-3 border-b border-gray-200">
                                                <div className="flex items-center gap-2">
                                                    <User className='h-5 w-5 text-gray-700' />
                                                    <p className="text-sm font-semibold text-gray-900">{userSession.nombre}</p>
                                                </div>
                                                <p className="text-xs text-gray-500 ml-7">{userSession.correo}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const panel = userSession.rol === 'OPERADOR' ? '/panel-operador' :(('ADMIN') ? '/panel-admin' : '/panel-usuario') 
                                                    window.location.href = panel
                                                }}
                                                className="flex items-center gap-2 w-full px-2 py-2 hover:bg-gray-100 rounded-md transition-all"
                                            >
                                                <PanelBottom className='h-5 w-5 text-gray-700' />
                                                <p className="text-sm font-medium text-gray-900">Mi Panel</p>
                                            </button>
                                            <button
                                                onClick={cerrarSesion}
                                                className="flex items-center gap-2 w-full px-2 py-2 hover:bg-red-50 rounded-md transition-all text-red-600"
                                            >
                                                <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                                </svg>
                                                <p className="text-sm font-medium">Cerrar Sesión</p>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login">
                                <Boton texto="Iniciar Sesión" bgColor="bg-gray-200 hover:bg-gray-200/70" textColor="text-black" />
                            </Link>
                        )}
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
                    {onImportantPage && (
                        <div className='grid grid-cols-2 gap-2 md:gap-4 items-center justify-center'>
                            <Link 
                                href="#habitaciones" 
                                className={`text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex rounded-lg ${
                                    seccionActiva === 'habitaciones' ? 'bg-black text-white font-semibold' : 'bg-gray-100'
                                }`} 
                                onClick={cerrarMenu}
                            >
                                Habitaciones
                            </Link>
                            <Link 
                                href="#reservas" 
                                className={`text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex rounded-lg ${
                                    seccionActiva === 'reservas' ? 'bg-black text-white font-semibold' : 'bg-gray-100'
                                }`} 
                                onClick={cerrarMenu}
                            >
                                Reservas
                            </Link>
                            <Link 
                                href="#Nosotros" 
                                className={`text-gray-800 hover:text-black transition-all py-2 items-center justify-center flex rounded-lg ${
                                    seccionActiva === 'Nosotros' ? 'bg-black text-white font-semibold' : 'bg-gray-100'
                                }`} 
                                onClick={cerrarMenu}
                            >
                                Nosotros
                            </Link>
                        </div>
                    )}
                    <div className='flex flex-col gap-3 pt-4 border-t border-gray-200'>
                        {userSession ? (
                            <>
                                <div className='px-4 py-3 bg-gray-50 rounded-lg'>
                                    <div className="flex items-center gap-2 mb-1">
                                        <User className='h-5 w-5 text-gray-700' />
                                        <p className="text-sm font-semibold text-gray-900">{userSession.nombre}</p>
                                    </div>
                                    <p className="text-xs text-gray-500 ml-7">{userSession.correo}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const panel = userSession.rol === 'OPERADOR' ? '/panel-operador' : '/panel-usuario'
                                        cerrarMenu()
                                        window.location.href = panel
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                                >
                                    <PanelBottom className='h-5 w-5 text-gray-700' />
                                    <p className="text-sm font-medium text-gray-900">Mi Panel</p>
                                </button>
                                <button
                                    onClick={() => {
                                        cerrarMenu()
                                        cerrarSesion()
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-3 bg-red-50 hover:bg-red-100 rounded-lg transition-all text-red-600"
                                >
                                    <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                    </svg>
                                    <p className="text-sm font-medium">Cerrar Sesión</p>
                                </button>
                            </>
                        ) : (
                            <Link href="/auth/login" onClick={cerrarMenu}>
                                <Boton texto="Iniciar Sesión" bgColor="bg-gray-200 hover:bg-gray-200/70" textColor="text-black" />
                            </Link>
                        )}
                        <Link href="/reserva" className='w-full' onClick={cerrarMenu}>
                            <Boton texto="Reservar" bgColor="bg-black hover:bg-black/90" textColor="text-white" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav >
    )
}