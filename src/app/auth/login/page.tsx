'use client'

import Icono from '@/componentes/ui/Icono'
import Link from 'next/link'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Shield, Briefcase } from 'lucide-react'

// Usuarios de prueba para testing
const USUARIOS_PRUEBA = [
    {
        id: 'user-001',
        nombre: 'Usuario Demo',
        correo: 'usuario@demo.com',
        password: 'demo123',
        rol: 'USUARIO' as const,
        telefono: '+598 99 111 222',
        icon: User,
        color: 'bg-blue-500'
    },
    {
        id: 'admin-001',
        nombre: 'Admin Demo',
        correo: 'admin@demo.com',
        password: 'admin123',
        rol: 'ADMINISTRADOR' as const,
        telefono: '+598 99 333 444',
        icon: Shield,
        color: 'bg-purple-500'
    },
    {
        id: 'op-001',
        nombre: 'Operador Demo',
        correo: 'operador@demo.com',
        password: 'operador123',
        rol: 'OPERADOR' as const,
        telefono: '+598 99 555 666',
        icon: Briefcase,
        color: 'bg-green-500'
    }
]

function LoginContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const loginConUsuarioPrueba = (usuario: typeof USUARIOS_PRUEBA[0]) => {
        setLoading(true)
        setSuccess(`Iniciando sesión como ${usuario.nombre}...`)
        
        const sessionData = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            telefono: usuario.telefono
        }
        
        localStorage.clear()
        
        localStorage.setItem('userToken', 'demo-token-' + usuario.id)
        localStorage.setItem('userSession', JSON.stringify(sessionData))
        
        setTimeout(() => {
            if (redirect) {
                router.push(redirect)
            } else if (usuario.rol === 'ADMINISTRADOR') {
                router.push('/panel-admin')
            } else if (usuario.rol === 'OPERADOR') {
                router.push('/panel-operador')
            } else {
                router.push('/')
            }
        }, 1000)
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-screen py-8 space-y-6 bg-blue-100/20">
            <Icono />
            <h1 className='text-3xl font-bold'>Inicia Sesión</h1>
            
            {/* Usuarios de prueba */}
            <div className='w-full max-w-lg bg-white p-6 rounded-lg shadow-md'>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>👤 Usuarios de Prueba (Demo)</h2>
                <p className='text-sm text-gray-600 mb-4'>Haz clic en cualquier usuario para iniciar sesión automáticamente:</p>
                <div className='space-y-3'>
                    {USUARIOS_PRUEBA.map((usuario) => {
                        const IconComponent = usuario.icon
                        return (
                            <button
                                key={usuario.id}
                                onClick={() => loginConUsuarioPrueba(usuario)}
                                disabled={loading}
                                className='w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left group'
                            >
                                <div className={`${usuario.color} text-white p-3 rounded-full group-hover:scale-110 transition-transform`}>
                                    <IconComponent className='h-6 w-6' />
                                </div>
                                <div className='flex-1'>
                                    <p className='font-semibold text-gray-900'>{usuario.nombre}</p>
                                    <p className='text-sm text-gray-600'>{usuario.correo}</p>
                                    <p className='text-xs text-gray-500 mt-1'>Rol: {usuario.rol}</p>
                                </div>
                                <div className='text-sm text-gray-400'>
                                    Clic para entrar →
                                </div>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className='text-sm text-gray-500'>- O -</div>

            <form className='flex flex-col gap-4 w-full max-w-lg bg-white p-10 rounded-lg shadow-md font-sans'>
                <label htmlFor="correo">Email</label>
                <input type="email" id="correo" className='border border-gray-200 rounded-lg p-2 w-full' name="correo" required />

                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" className='border border-gray-200 rounded-lg p-2' name="password" pattern=".{6,}" required />
                <div className='flex flex-row items-center gap-2'>
                    <div className='flex justify-start items-center gap-2'>
                        <input type="checkbox" id="recordar" name="recordar" className='w-4 h-4 bg-black' />
                        <label htmlFor="recordar">Recordarme</label>
                    </div>
                    <div className='flex justify-end items-center gap-2 w-full'>
                        <Link href="/forgot-password" className='text-blue-500 hover:text-blue-600 transition-all mx-2'>¿Olvidaste tu contraseña?</Link>
                    </div>
                </div>
                {error && (
                    <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded'>
                        <p className='font-medium'>Error</p>
                        <p className='text-sm'>{error}</p>
                    </div>
                )}
                {success && (
                    <div className='bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded'>
                        <p className='font-medium'>¡Éxito!</p>
                        <p className='text-sm'>{success}</p>
                    </div>
                )}
                <button type="submit" disabled={loading} onClick={async (e) => {
                    e.preventDefault(); // Prevent default form submission
                    setLoading(true);
                    setError('');
                    setSuccess('');
                    const form = e.currentTarget.form;
                    if (!form) return;
                    const formData = new FormData(form);
                    const data = {
                        correo: formData.get('correo'),
                        password: formData.get('password'),
                        recordar: formData.get('recordar') === 'on',
                    }
                    try {
                        // Backend deshabilitado - Solo UI visual
                        setSuccess('Redirigiendote...')
                        form.reset();

                        // Limpiar localStorage y guardar sesión de usuario genérico
                        localStorage.clear()
                        const genericUserSession = {
                            id: 'generic-user',
                            nombre: 'Usuario',
                            correo: data.correo as string,
                            rol: 'USUARIO',
                            telefono: ''
                        }
                        localStorage.setItem('userToken', 'token-generic')
                        localStorage.setItem('userSession', JSON.stringify(genericUserSession))

                        setTimeout(() => {
                            if (redirect) {
                                router.push(redirect)
                            }
                            else {
                                router.push('/')
                            }
                        }, 1000)
                    } catch (err) {
                        setError('Error de conexión. Por favor intenta de nuevo.')
                    } finally {
                        setLoading(false);
                    }
                }} className='bg-black hover:bg-black/90 text-white py-2 rounded-lg font-bold cursor-pointer transition-all'>Iniciar Sesión</button>
                <p>¿No tienes cuenta? <Link href="/auth/register" className='text-blue-500 hover:text-blue-600 transition-all mx-2'>Registrate</Link></p>
            </form>
        </section >
    )
}

export default function Login() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <LoginContent />
        </Suspense>
    )
}