'use client'

import Boton from './ui/Boton'

export default function Hero() {
    return (
        <section className="relative w-full h-[750px] overflow-hidden snap-y snap-mandatory bg-white">
            <div className="bg-[url('/luxury-hotel-lobby-modern.png')] bg-cover bg-center absolute inset-0 z-10"></div>
            <div className="bg-gradient-to-r from-background/80 to-background/50 w-full h-full absolute z-20"></div>
            <div className="contenedor relative z-30 flex h-full">
                <div className="flex items-center justify-start w-full">
                    <div className="flex flex-col items-start space-y-3 md:space-y-4 w-full max-w-3xl">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                            Experiencia de lujo en el corazón de Salta
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-900/90">
                            Descubrí el equilibrio perfecto entre confort, elegancia y hospitalidad Argentina
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Boton texto="Ver Habitaciones" onClick={() => window.location.href = 'habitaciones'}/>
                            <Boton texto="Reservar Ahora" bgColor='bg-white hover:bg-gray-100 border-2 border-black' textColor='text-black' onClick={() => window.location.href = 'reserva'}/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}