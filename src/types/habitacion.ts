// Tipo que coincide con el schema de Prisma (Room)
export interface Habitacion {
    id: number; // Cambio: ahora es Int en Prisma
    numero: number;
    tipo: string;
    estado: 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA' | 'MANTENIMIENTO';
    precio: number;
    capacidad: number;
    descripcion: string | null;
    comodidades: string[] | string; // Array de comodidades o string separado por comas
    imagen: string | null; // Cambio: singular, no array
    lat: number | null; // Cambio: coordenadas separadas
    lng: number | null;
    
    // Propiedades opcionales para compatibilidad con código legacy
    imagenes?: string[]; // Para componentes que aún usan imagenes[]
}
