'use client'

import Icono from '@/componentes/ui/Icono'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Login() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')
    
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    return (
        <section className="flex flex-col items-center justify-center h-screen space-y-6 bg-blue-100/20">
            <Icono />
            <h1 className='text-3xl font-bold'>Inicia Sesión</h1>
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
                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(data),
                        });
                        const result = await response.json()
                        if (response.ok) {
                            setSuccess(result.mensaje + ' redirigiendo...')
                            form.reset();

                            // Guardar sesión en localStorage
                            localStorage.setItem('userToken', result.token)
                            localStorage.setItem('userSession', JSON.stringify(result.usuario))
                            
                            setTimeout(() => {
                                // Si hay redirect, ir ahí
                                if (redirect) {
                                    router.push(redirect)
                                } 
                                // Si es operador, ir al panel
                                else if (result.usuario.rol === 'OPERADOR') {
                                    router.push('/panel-operador')
                                } 
                                // Usuario normal, ir a inicio
                                else {
                                    router.push('/')
                                }
                            }, 1000)
                        } else {
                            setError(result.mensaje || result.error || 'Error al iniciar sesión');
                        }
                    } catch (err) {
                        setError('Error de conexión. Por favor intenta de nuevo.')
                    } finally {
                        setLoading(false);
                    }
                }} className='bg-black hover:bg-black/90 text-white py-2 rounded-lg font-bold cursor-pointer transition-all'>Iniciar Sesión</button>
                <p>¿No tienes cuenta? <Link href="/register" className='text-blue-500 hover:text-blue-600 transition-all mx-2'>Registrate</Link></p>
            </form>
        </section >
    )
}