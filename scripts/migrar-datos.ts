/* import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Leer archivos JSON
const usuariosPath = path.join(process.cwd(), 'data', 'usuarios.json')
const habitacionesPath = path.join(process.cwd(), 'data', 'habitaciones.json')

const usuariosJSON = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'))
const habitacionesJSON = JSON.parse(fs.readFileSync(habitacionesPath, 'utf-8'))

async function migrarUsuarios() {
    console.log('🔄 Migrando usuarios...')
    
    for (const usuario of usuariosJSON) {
        try {
            // Verificar si el email ya existe
            const existente = await prisma.user.findUnique({
                where: { email: usuario.correo }
            })

            if (existente) {
                console.log(`⚠️  Usuario ${usuario.correo} ya existe, saltando...`)
                continue
            }

            // Crear usuario
            const nuevoUsuario = await prisma.user.create({
                data: {
                    nombre: usuario.nombre,
                    email: usuario.correo,
                    password: usuario.password, // ⚠️ En texto plano - considerar hashear
                    rol: usuario.rol as 'USUARIO' | 'OPERADOR',
                    // createdAt se asigna automáticamente
                }
            })

            console.log(`✅ Usuario creado: ${nuevoUsuario.email} (ID: ${nuevoUsuario.id})`)
        } catch (error) {
            console.error(`❌ Error al crear usuario ${usuario.correo}:`, error)
        }
    }

    console.log('✅ Migración de usuarios completada\n')
}

async function migrarHabitaciones() {
    console.log('🔄 Migrando habitaciones...')
    
    for (const habitacion of habitacionesJSON) {
        try {
            // Verificar si el número ya existe
            const existente = await prisma.room.findUnique({
                where: { numero: habitacion.numero }
            })

            if (existente) {
                console.log(`⚠️  Habitación ${habitacion.numero} ya existe, saltando...`)
                continue
            }

            // Mapear tipo a MAYÚSCULAS (enum de Prisma)
            // Tomar solo la primera palabra para casos como "Suite Presidencial" → "SUITE"
            const tipoPalabra = habitacion.tipo.split(' ')[0].toUpperCase()
            let tipoMapeado: 'SIMPLE' | 'DOBLE' | 'SUITE'
            
            if (tipoPalabra === 'SIMPLE') tipoMapeado = 'SIMPLE'
            else if (tipoPalabra === 'DOBLE') tipoMapeado = 'DOBLE'
            else if (tipoPalabra === 'SUITE') tipoMapeado = 'SUITE'
            else {
                console.log(`⚠️  Tipo desconocido "${habitacion.tipo}", usando SIMPLE por defecto`)
                tipoMapeado = 'SIMPLE'
            }

            // Crear habitación (NO incluir id, Prisma lo autogenera)
            const nuevaHabitacion = await prisma.room.create({
                data: {
                    numero: habitacion.numero,
                    tipo: tipoMapeado,
                    precio: habitacion.precio,
                    estado: habitacion.estado as 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO',
                    capacidad: habitacion.capacidad,
                    descripcion: habitacion.descripcion || null,
                    imagen: habitacion.imagenes?.[0] || null, // Toma la primera imagen
                    lat: habitacion.coordenadas?.y || null,  // y → lat
                    lng: habitacion.coordenadas?.x || null   // x → lng
                }
            })

            console.log(`✅ Habitación creada: ${nuevaHabitacion.numero} - ${nuevaHabitacion.tipo} (ID: ${nuevaHabitacion.id})`)
        } catch (error) {
            console.error(`❌ Error al crear habitación ${habitacion.numero}:`, error)
        }
    }

    console.log('✅ Migración de habitaciones completada\n')
}

async function main() {
    console.log('🚀 Iniciando migración de datos JSON a PostgreSQL\n')
    
    try {
        // Migrar en orden: primero usuarios, luego habitaciones
        await migrarUsuarios()
        await migrarHabitaciones()
        
        console.log('🎉 ¡Migración completada exitosamente!')
        
        // Mostrar resumen
        const totalUsuarios = await prisma.user.count()
        const totalHabitaciones = await prisma.room.count()
        
        console.log('\n📊 Resumen:')
        console.log(`   Usuarios en BD: ${totalUsuarios}`)
        console.log(`   Habitaciones en BD: ${totalHabitaciones}`)
        
    } catch (error) {
        console.error('❌ Error durante la migración:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
 */