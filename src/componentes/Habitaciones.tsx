import HabitacionesCard from "@/componentes/ui/HabitacionesCard"

export default function Habitaciones() {
    const habitaciones = [
        {
            titulo: "Habitación Estándar",
            descripcion: "Perfecta para una estadía cómoda y relajante",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Cama queen", "Wi-Fi gratis", "TV cable"]
        },
        {
            titulo: "Habitación Deluxe",
            descripcion: "Espacio amplio con todas las comodidades",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Cama king", "Vista panorámica", "Mini bar"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Lujo y exclusividad para tu estadía",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio 24/7"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Lujo y exclusividad para tu estadía",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio 24/7"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Lujo y exclusividad para tu estadía",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio 24/7"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Lujo y exclusividad para tu estadía",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio 24/7"]
        },
        {
            titulo: "Suite Ejecutiva",
            descripcion: "Lujo y exclusividad para tu estadía",
            imagen: "https://placehold.co/600x400",
            precio: 1200,
            caracteristicas: ["Sala de estar", "Jacuzzi", "Servicio 24/7"]
        }
    ]; /* Reemplazar este array con los datos en BD */

    return (
        <section className="contenedor my-12 space-y-7 gap-5">
            <div className="flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center">¡Conocé sobre nuestras Habitaciones!</h2>
                <span className="text-gray-500 text-xl">Tu habitación perfecta para tu estadía</span>
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