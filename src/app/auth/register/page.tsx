'use client'

import Icono from '@/componentes/ui/Icono'
import Link from 'next/link'
import { useState } from 'react'

export default function Register() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    return (
        <section className="flex flex-col items-center justify-center min-h-screen py-8 space-y-6 bg-blue-100/20">
            <Icono />
            <h1 className='text-3xl font-bold'>Registrate</h1>
            <form className='flex flex-col gap-4 w-full max-w-lg bg-white py-6 px-10 rounded-lg shadow-md font-sans'>
                <div className='grid grid-cols-2 gap-4'>
                    <div className='relative'>
                        <label htmlFor="nombre" className='absolute top-0 left-0 w-full'>Nombre</label>
                        <input type="text" id="nombre" className='border border-gray-200 rounded-lg p-2 mt-8 w-full' name="nombre" required />
                    </div>
                    <div className='relative'>
                        <label htmlFor="correo" className='absolute top-0 left-0 w-full'>Email</label>
                        <input type="email" id="correo" className='border border-gray-200 rounded-lg p-2 mt-8 w-full' name="correo" required />
                    </div>
                </div>
                <label htmlFor="password">Contraseña</label>
                <input type="password" id="password" className='border border-gray-200 rounded-lg p-2' name="password" pattern=".{6,}" required />
                <label htmlFor="passwordConfirmada">Confirmar Contraseña</label>
                <input type="password" id="passwordConfirmada" className='border border-gray-200 rounded-lg p-2' name="passwordConfirmada" pattern=".{6,}" required />
                
                {/* Mensaje de error */}
                {error && (
                    <div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded'>
                        <p className='font-medium'>Error</p>
                        <p className='text-sm'>{error}</p>
                    </div>
                )}

                {/* Mensaje de éxito */}
                {success && (
                    <div className='bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded'>
                        <p className='font-medium'>¡Éxito!</p>
                        <p className='text-sm'>{success}</p>
                    </div>
                )}

                <button type="submit" disabled={loading} onClick={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    setError('');
                    setSuccess('');

                    const form = e.currentTarget.form;
                    if (!form) return;
                    
                    const formData = new FormData(form);
                    const body = Object.fromEntries(formData.entries());
                    
                    try {
                        const response = await fetch('/api/register', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body),
                        });
                        
                        const result = await response.json();
                        
                        if (response.ok && result.success) {
                            setSuccess(result.mensaje + ' Redirigiendo al login...');
                            form.reset();
                            setTimeout(() => {
                                window.location.href = '/auth/login';
                            }, 2000);
                        } else {
                            setError(result.mensaje || result.error || 'Error al registrar');
                        }
                    } catch (err) {
                        setError('Error de conexión. Por favor intenta de nuevo.');
                    } finally {
                        setLoading(false);
                    }
                }} className='bg-black hover:bg-black/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg font-bold cursor-pointer transition-all'>
                    {loading ? 'Registrando...' : 'Registrarte'}
                </button>
                <p>¿Ya tienes cuenta? <Link href="/auth/login" className='text-blue-500 hover:text-blue-600 transition-all mx-2'>Inicia Sesión</Link></p>
            </form>
        </section>
    )
}