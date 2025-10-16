export interface Habitacion {
    id: string;
    numero: number;
    tipo: string;
    piso: number;
    estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO' | 'RESERVADA';
    precio: number;
    capacidad: number;
    descripcion: string;
    comodidades: string[];
    coordenadas: { x: number; y: number };
    imagenes: string[];
}
