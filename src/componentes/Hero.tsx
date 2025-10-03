import Boton from './ui/Boton'

export default function Hero() {
    return (
        <section className="relative w-full h-[750px] overflow-hidden snap-y snap-mandatory bg-white">
            <div className="bg-[url('/luxury-hotel-lobby-modern.png')] bg-cover bg-center absolute inset-0 z-10"></div>
            <div className="bg-gradient-to-r from-background/80 to-background/50 w-full h-full absolute z-20"></div>
            <div className="contenedor relative z-30 flex h-full">
                <div className="flex items-center justify-start w-full">
                    <div className="flex flex-col items-start space-y-3 md:space-y-4 w-full">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">Frase para atrapar la atención</h1>
                        <p className="text-lg md:text-xl lg:text-2xl text-gray-900/90">Descripción corta del hotel/página</p>
                        <Boton texto="Habitaciones" bgColor='bg-black hover:bg-black/90'/>
                    </div>
                </div>
            </div>
        </section>
    )
}