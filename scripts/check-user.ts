// Script para verificar si un usuario existe en la base de datos

import { prisma } from '../src/lib/prisma'

async function checkUser() {
  const userId = 'cmgv1hit8000008cth9ssotqz'
  
  console.log(`🔍 Buscando usuario con ID: ${userId}`)
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reservations: true
      }
    })

    if (user) {
      console.log('✅ Usuario encontrado:')
      console.log({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        reservas: user.reservations.length
      })
    } else {
      console.log('❌ Usuario NO encontrado')
      console.log('\n📝 Creando usuario demo...')
      
      const newUser = await prisma.user.create({
        data: {
          id: userId,
          nombre: 'Usuario Demo',
          email: 'demo@hotel.com',
          password: '$2a$10$demoPasswordHash', // Hash ficticio
          rol: 'USUARIO',
          telefono: '+54 11 1234-5678'
        }
      })
      
      console.log('✅ Usuario demo creado:')
      console.log({
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email
      })
    }
    
    // Listar todos los usuarios
    console.log('\n📋 Usuarios en la base de datos:')
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true
      }
    })
    console.table(allUsers)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUser()
