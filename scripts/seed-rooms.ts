import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('🌱 Ejecutando seed de habitaciones...')
        
        // Limpiar tabla existente
        console.log('🗑️  Limpiando habitaciones existentes...')
        await prisma.room.deleteMany()
        
        // Datos de habitaciones desde el JSON original
        const habitaciones = [
            { numero: 101, tipo: 'Simple', estado: 'DISPONIBLE', precio: 50000, capacidad: 1, 
              descripcion: 'Habitación simple con cama individual y baño privado',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'],
              imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', lat: 30, lng: 20 },
            
            { numero: 102, tipo: 'Doble', estado: 'OCUPADA', precio: 80000, capacidad: 2,
              descripcion: 'Habitación doble con dos camas individuales',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar'],
              imagen: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', lat: 60, lng: 20 },
            
            { numero: 103, tipo: 'Suite', estado: 'DISPONIBLE', precio: 150000, capacidad: 2,
              descripcion: 'Suite de lujo con sala de estar y jacuzzi',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar'],
              imagen: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', lat: 90, lng: 20 },
            
            { numero: 201, tipo: 'Simple', estado: 'MANTENIMIENTO', precio: 50000, capacidad: 1,
              descripcion: 'Habitación simple con cama individual',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'],
              imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', lat: 30, lng: 50 },
            
            { numero: 202, tipo: 'Doble', estado: 'DISPONIBLE', precio: 80000, capacidad: 2,
              descripcion: 'Habitación doble con cama matrimonial',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar'],
              imagen: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', lat: 60, lng: 50 },
            
            { numero: 203, tipo: 'Suite', estado: 'DISPONIBLE', precio: 150000, capacidad: 3,
              descripcion: 'Suite premium con balcón privado',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar', 'Balcón'],
              imagen: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', lat: 90, lng: 50 },
            
            { numero: 301, tipo: 'Simple', estado: 'DISPONIBLE', precio: 55000, capacidad: 1,
              descripcion: 'Habitación simple en piso superior',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'],
              imagen: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', lat: 30, lng: 80 },
            
            { numero: 302, tipo: 'Doble', estado: 'OCUPADA', precio: 85000, capacidad: 2,
              descripcion: 'Habitación doble con vista panorámica',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Vista panorámica'],
              imagen: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', lat: 60, lng: 80 },
            
            { numero: 303, tipo: 'Suite Presidencial', estado: 'DISPONIBLE', precio: 250000, capacidad: 4,
              descripcion: 'Suite presidencial con todas las comodidades',
              comodidades: ['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar', 'Balcón', 'Cocina', 'Sala de reuniones'],
              imagen: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', lat: 90, lng: 80 },
        ]
        
        // Insertar habitaciones usando Prisma
        console.log('📥 Insertando habitaciones...')
        for (const hab of habitaciones) {
            await prisma.room.create({
                data: hab as any
            })
            console.log(`  ✓ Habitación ${hab.numero} insertada`)
        }
        
        console.log('✅ Habitaciones insertadas correctamente!')
        
        // Mostrar resumen final
        const count = await prisma.room.count()
        console.log(`📈 Total de habitaciones en la BD: ${count}`)
        
        const habitacionesDB = await prisma.room.findMany({
            select: {
                numero: true,
                tipo: true,
                estado: true,
                comodidades: true
            },
            orderBy: { numero: 'asc' }
        })
        
        console.log('\n📋 Habitaciones insertadas:')
        habitacionesDB.forEach(h => {
            console.log(`  - Hab ${h.numero} (${h.tipo}) - ${h.estado} - ${h.comodidades.length} comodidades`)
        })
        
    } catch (error) {
        console.error('❌ Error al ejecutar seed:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
