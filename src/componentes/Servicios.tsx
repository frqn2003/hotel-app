export default function Servicios() {
    const ServiciosDatos = [
        {
            titulo: "WiFi gratis",
            descripcion: "Internet de altas velocidades en todas las áreas",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-wifi-icon lucide-wifi"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>
        },
        {
            titulo: "Piscina",
            descripcion: "Piscina al aire libre con vistas al jardín",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-waves-ladder-icon lucide-waves-ladder"><path d="M19 5a2 2 0 0 0-2 2v11"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M7 13h10"/><path d="M7 9h10"/><path d="M9 5a2 2 0 0 0-2 2v11"/></svg>
        },
        {
            titulo: "Gimnasio",
            descripcion: "Gimnasio con equipamiento completo para todos los niveles",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-weight-icon lucide-weight"><path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/></svg>
        },
        {
            titulo: "Restaurante",
            descripcion: "Restaurante con cocina internacional y local con vistas al jardín",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-utensils-crossed-icon lucide-utensils-crossed"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/></svg>
        },
        {
            titulo: "Spa",
            descripcion: "Spa con sauna, jacuzzi y masajes",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bubbles-icon lucide-bubbles"><path d="M7.2 14.8a2 2 0 0 1 2 2"/><circle cx="18.5" cy="8.5" r="3.5"/><circle cx="7.5" cy="16.5" r="5.5"/><circle cx="7.5" cy="4.5" r="2.5"/></svg>
        },
        {
            titulo: "Estacionamiento",
            descripcion: "Parking gratuito para todos los huéspedes",
            imagen: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-parking-icon lucide-circle-parking"><circle cx="12" cy="12" r="10"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>
        }
    ]
    return (
        <section className="bg-gray-100">
            <div className="contenedor py-6 space-y-2">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black text-center py-4">Servicios & Amenidades</h2>
                <p className="text-gray-600 text-lg text-center pb-2 max-w-2xl mx-auto">
                    Diseñados para hacer tu estadía inolvidable, con comodidades que superan tus expectativas
                </p>

                <div className="items-center justify-between grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
                    {ServiciosDatos.map((servicio, index) => (
                        <div key={index} className="flex flex-row bg-white p-6 rounded-md shadow-md gap-6">
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex justify-center items-center"> {servicio.imagen}</div>
                            <div className="flex flex-col items-start justify-center space-y-1">
                                <h2 className="text-lg font-semibold">{servicio.titulo}</h2>
                                <h4 className="text-black/90 text-sm">{servicio.descripcion}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
    

}