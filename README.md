This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## 📁 Estructura del Proyecto

```
hotel-app/
├── prisma/
│   └── schema.prisma          # Schema de base de datos
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   ├── habitaciones/      # Páginas de habitaciones
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── componentes/           # Componentes React
│   │   ├── ui/                # Componentes UI reutilizables
│   │   ├── Navbar.tsx
│   │   └── ...
│   └── lib/
│       ├── prisma.ts          # Cliente de Prisma
│       └── ...
├── public/                    # Archivos estáticos
├── .env.local                 # Variables de entorno (no commitear)
├── package.json
└── README.md
```

## 🎯 Funcionalidades

### Panel de Usuario
- ✅ Ver listado de habitaciones disponibles
- ✅ Filtrar habitaciones por tipo, precio, capacidad
- ✅ Crear reservas
- ✅ Ver historial de reservas
- ✅ Enviar consultas por email
- ✅ Login con Google OAuth

### Panel de Operador
- ✅ Vista de mapa con ubicación de habitaciones
- ✅ CRUD completo de reservas
- ✅ Cambiar estados de habitaciones (disponible/ocupada/mantenimiento)
- ✅ Procesar pagos con Stripe
- ✅ Responder consultas de clientes
- ✅ Dashboard con estadísticas

## 🗄️ Modelos de Base de Datos

### User
- Información de usuario
- Rol (USUARIO/OPERADOR)
- Relación con reservas

### Room
- Número, tipo, precio
- Estado (DISPONIBLE/OCUPADA/MANTENIMIENTO)
- Coordenadas para mapa
- Relación con reservas

### Reservation
- Fechas de entrada/salida
- Número de huéspedes
- Estado de reserva y pago
- Relaciones con User y Room

## 🧪 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Prisma Studio (GUI para DB)
npx prisma studio

# Resetear base de datos
npx prisma migrate reset

# Generar tipos de Prisma
npx prisma generate
```

## 🚢 Deploy en Vercel

1. Subir código a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno
4. Vercel creará automáticamente la base de datos Postgres
5. Deploy automático

## 📚 Documentación Adicional

- [Guía para Principiantes](./GUIA_PARA_PRINCIPIANTES.md)
- [Plan del Proyecto](./plan_proyecto_hotel.txt)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Docs](https://nextjs.org/docs)

## 👥 Contribuidores

Proyecto académico desarrollado por [tu nombre/equipo]

## 📝 Licencia

MIT
