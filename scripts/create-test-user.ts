import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Crear usuario de prueba con el mismo ID que está en localStorage
    const usuario = await prisma.user.create({
        data: {
            id: 'cmguzry260000xpe9hsvca3xx', // El ID que está en tu localStorage
            nombre: 'Usuario Test',
            email: 'test@hotel.com',
            password: 'password123', // En producción debería estar hasheado
            rol: 'USUARIO'
        }
    })

    console.log('✅ Usuario de prueba creado:', usuario)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
