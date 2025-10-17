# 📚 Guía Completa - Sistema de Reservas con Prisma

## 🎯 Flujo Completo de una Reserva

```
1. Usuario navega a /habitaciones
   ↓
2. Ve lista de habitaciones disponibles
   ↓
3. Click en "Reservar" → Redirige a /reserva?habitacion=5
   ↓
4. Página carga datos de la habitación desde API
   ↓
5. Usuario completa formulario (fechas, huéspedes, notas)
   ↓
6. Sistema calcula precio automáticamente (días × precio)
   ↓
7. Click "Confirmar Reserva" → POST /api/reservas
   ↓
8. Prisma inserta en tabla Reservation
   ↓
9. Prisma actualiza estado de Room a 'OCUPADA'
   ↓
10. Redirige a /habitaciones con mensaje de éxito
```

---

## 📁 Archivos Importantes

### **Frontend**
- `/src/app/reserva/page.tsx` - Página de reserva con formulario
- `/src/app/habitaciones/page.tsx` - Lista de habitaciones

### **Backend (API Routes)**
- `/src/app/api/reservas/route.ts` - GET (listar) y POST (crear)
- `/src/app/api/habitaciones/route.ts` - GET (listar) y POST (obtener una)
- `/src/app/api/login/route.ts` - Autenticación
- `/src/app/api/register/route.ts` - Registro de usuarios

### **Base de Datos**
- `/prisma/schema.prisma` - Definición de modelos (User, Room, Reservation)
- `/src/lib/prisma.ts` - Cliente de Prisma configurado

---

## 🔧 Operaciones Prisma

### **Crear Reserva**
```typescript
const reserva = await prisma.reservation.create({
    data: {
        userId: 1,
        roomId: 5,
        fechaEntrada: new Date('2025-10-20'),
        fechaSalida: new Date('2025-10-22'),
        huespedes: 2,
        precioTotal: 150.00,
        notasEspeciales: 'Cama extra',
        estado: 'PENDIENTE',
        pagado: false
    },
    include: {
        user: true,  // Incluye datos del usuario
        room: true   // Incluye datos de la habitación
    }
})
```

### **Listar Reservas**
```typescript
const reservas = await prisma.reservation.findMany({
    include: {
        user: true,
        room: true
    },
    orderBy: {
        createdAt: 'desc'
    }
})
```

### **Buscar Reserva por ID**
```typescript
const reserva = await prisma.reservation.findUnique({
    where: { id: 1 },
    include: {
        user: true,
        room: true
    }
})
```

### **Actualizar Estado de Reserva**
```typescript
const actualizada = await prisma.reservation.update({
    where: { id: 1 },
    data: { 
        estado: 'CONFIRMADA',
        pagado: true 
    }
})
```

### **Cancelar Reserva**
```typescript
const cancelada = await prisma.reservation.update({
    where: { id: 1 },
    data: { estado: 'CANCELADA' }
})
```

### **Eliminar Reserva**
```typescript
const eliminada = await prisma.reservation.delete({
    where: { id: 1 }
})
```

---

## 📊 Estructura de Datos

### **JSON enviado desde el frontend**
```json
{
  "userId": 1,
  "roomId": 5,
  "fechaEntrada": "2025-10-20",
  "fechaSalida": "2025-10-22",
  "huespedes": 2,
  "precioTotal": 150,
  "notasEspeciales": "Cama extra"
}
```

### **Respuesta de la API**
```json
{
  "success": true,
  "data": {
    "id": 10,
    "userId": 1,
    "roomId": 5,
    "fechaEntrada": "2025-10-20T00:00:00.000Z",
    "fechaSalida": "2025-10-22T00:00:00.000Z",
    "huespedes": 2,
    "precioTotal": 150,
    "estado": "PENDIENTE",
    "pagado": false,
    "notasEspeciales": "Cama extra",
    "createdAt": "2025-10-17T12:00:00.000Z",
    "updatedAt": "2025-10-17T12:00:00.000Z",
    "user": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "rol": "USUARIO"
    },
    "room": {
      "id": 5,
      "numero": 101,
      "tipo": "DOBLE",
      "precio": 75,
      "estado": "OCUPADA",
      "capacidad": 2
    }
  }
}
```

---

## ⚠️ TODO: Pendientes

### **1. Autenticación de Usuario**
Actualmente usa `userId: 1` hardcoded en línea 144 de `/src/app/reserva/page.tsx`

**Solución:**
- Implementar NextAuth o sistema de sesiones
- Obtener userId del usuario logueado
- Proteger la ruta para que solo usuarios autenticados puedan reservar

```typescript
// Ejemplo con NextAuth
import { useSession } from 'next-auth/react'

const { data: session } = useSession()
const userId = session?.user?.id
```

### **2. Validar Disponibilidad de Fechas**
Verificar que la habitación no tenga reservas en esas fechas

**Agregar en `/src/app/api/reservas/route.ts`:**
```typescript
// Verificar conflictos de fechas
const reservasConflicto = await prisma.reservation.findMany({
    where: {
        roomId,
        estado: { in: ['PENDIENTE', 'CONFIRMADA'] },
        OR: [
            {
                fechaEntrada: { lte: new Date(fechaSalida) },
                fechaSalida: { gte: new Date(fechaEntrada) }
            }
        ]
    }
})

if (reservasConflicto.length > 0) {
    return NextResponse.json(
        { success: false, error: 'La habitación no está disponible en esas fechas' },
        { status: 400 }
    )
}
```

### **3. Hashear Contraseñas**
Instalar bcrypt y actualizar register/login:

```bash
npm install bcrypt @types/bcrypt
```

### **4. Migrar Habitaciones a Prisma**
Actualmente usa archivos JSON, debería usar la base de datos

---

## 🧪 Cómo Probar

### **1. Crear una habitación en la BD**
```sql
INSERT INTO "Room" (numero, tipo, precio, capacidad, descripcion, estado)
VALUES (101, 'DOBLE', 75, 2, 'Habitación doble con vista al mar', 'DISPONIBLE');
```

### **2. Crear un usuario**
Ve a `/auth/register` y regístrate

### **3. Hacer una reserva**
1. Ve a `/habitaciones`
2. Click en "Reservar" en cualquier habitación
3. Completa el formulario
4. Click "Confirmar Reserva"

### **4. Verificar en la base de datos**
```sql
SELECT * FROM "Reservation" ORDER BY "createdAt" DESC LIMIT 1;
```

---

## 🐛 Errores Comunes

### **Error: "Environment variable not found"**
- Verifica que `.env` existe con `PRISMA_DATABASE_URL` y `POSTGRES_URL`
- Ejecuta: `npx prisma generate`

### **Error: "User not found"**
- No hay usuarios en la base de datos
- Crea uno desde `/auth/register`

### **Error: "Room not found"**
- No hay habitaciones en la base de datos
- Migra habitaciones de JSON a Prisma o créalas manualmente

### **Error: Precio total $0**
- Las fechas no están seleccionadas correctamente
- Verifica que fechaSalida > fechaEntrada

---

## 📖 Recursos

- [Documentación Prisma](https://www.prisma.io/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [date-fns](https://date-fns.org/docs)
