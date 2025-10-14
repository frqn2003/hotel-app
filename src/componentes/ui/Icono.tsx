interface IconoProps {
    nombre?: string;
}

export default function Icono({ nombre }: IconoProps) {
    if (nombre) { return <a href="#" className="flex items-center gap-2 justify-start">
            <span className='h-10 w-10 md:h-12 md:w-12 rounded-xl bg-black text-white flex items-center justify-center text-sm md:text-md font-bold font-sans'>NJ</span>
            <div className='text-lg md:text-xl font-bold font-sans'>{nombre}</div>
        </a>
    } else { return <a href="#" className="flex items-center gap-2 justify-start">
            <span className='h-10 w-10 md:h-12 md:w-12 rounded-xl bg-black text-white flex items-center justify-center text-sm md:text-md font-bold font-sans'>NJ</span>
            <div className='text-lg md:text-xl font-bold font-sans'></div>
        </a>
    }
}