import HabitacionesCard from "@/componentes/ui/HabitacionesCard"

export default function Habitaciones() {
    // TODO: Reemplazar con datos de MongoDB cuando esté configurado
    const habitaciones = [
        {
            titulo: "Habitación Estándar",
            descripcion: "Elegante y funcional, ideal para viajeros individuales o parejas",
            imagen: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800",
            precio: 45000,
            caracteristicas: ["Cama queen", "Wi-Fi gratis", "TV Smart"]
        },
        {
            titulo: "Habitación Superior",
            descripcion: "Mayor espacio y confort con vista al parque",
            imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            precio: 62000,
            caracteristicas: ["Cama king", "Balcón privado", "Escritorio"]
        },
        {
            titulo: "Habitación Deluxe",
            descripcion: "Amplitud y luminosidad con amenidades premium",
            imagen: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800",
            precio: 78000,
            caracteristicas: ["2 camas", "Vista panorámica", "Mini bar"]
        },
        {
            titulo: "Suite Junior",
            descripcion: "Espacio dividido con sala de estar independiente",
            imagen: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800",
            precio: 95000,
            caracteristicas: ["Sala de estar", "Cama king", "Bañera"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Máximo confort para estadías de negocios o placer",
            imagen: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
            precio: 125000,
            caracteristicas: ["Living", "Jacuzzi", "Servicio 24/7"]
        },
        {
            titulo: "Suite Presidencial",
            descripcion: "La experiencia más exclusiva con servicios personalizados",
            imagen: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800",
            precio: 180000,
            caracteristicas: ["2 ambientes", "Terraza privada", "Mayordomo"]
        }
    ];

    return (
        <section className="contenedor my-12 space-y-7 gap-5">
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">Nuestras Habitaciones</h2>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl text-center">
                    Espacios diseñados para tu comodidad, desde opciones prácticas hasta suites de lujo
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {habitaciones.map((habitacion, index) => (
                    <HabitacionesCard key={index} {...habitacion} precio={habitacion.precio} />

                    /* Para cuando conecte mongodb tengo que cambiar el key = {index} por key={habitacion._id} Ejemplo:
                    // Cuando obtengas datos de la BD:
                        const habitaciones = await fetch('/api/habitaciones').then(r => r.json());

                        // En el render:
                        {habitaciones.map((habitacion) => (
                            <HabitacionesCard 
                                key={habitacion._id}  // MongoDB genera _id automáticamente
                                titulo={habitacion.titulo}
                                descripcion={habitacion.descripcion}
                                imagen={habitacion.imagen}
                                caracteristicas={habitacion.caracteristicas}
                            />
                        ))}*/
                ))}
            </div>
        </section>
    )
}