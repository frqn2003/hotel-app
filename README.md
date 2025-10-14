# 🏨 Hotel App - Sistema de Reservas Hoteleras

Aplicación web completa para gestión hotelera con Next.js, TypeScript, PostgreSQL y Prisma.

## 🚀 Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos modernos y responsivos
- **React Leaflet** - Mapas interactivos
- **Lucide React** - Iconos
- **React Hot Toast** - Notificaciones

### Backend
- **Next.js API Routes** - Endpoints RESTful
- **Prisma ORM** - ORM moderno para PostgreSQL
- **NextAuth.js** - Autenticación (Google OAuth)
- **Nodemailer** - Envío de emails
- **Stripe** - Procesamiento de pagos

### Base de Datos
- **Vercel Postgres** - PostgreSQL serverless
- **Prisma Client** - Type-safe database queries

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Cuenta de Vercel (para PostgreSQL)
- Cuenta de Google Cloud Console (OAuth)
- Cuenta de Stripe (pagos)

## 🛠️ Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/hotel-app.git
cd hotel-app
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env.local`:

```env
# Base de datos (Vercel Postgres)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Autenticación
NEXTAUTH_SECRET="tu_secret_key_aqui"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="tu_google_client_id"
GOOGLE_CLIENT_SECRET="tu_google_client_secret"

# Servicios externos
STRIPE_SECRET_KEY="tu_stripe_secret_key"
EMAIL_USER="tu_email@gmail.com"
EMAIL_PASSWORD="tu_app_password"
```

4. **Configurar base de datos con Prisma**

```bash
# Generar cliente de Prisma
npx prisma generate

# Sincronizar schema con la base de datos
npx prisma db push

# (Opcional) Poblar con datos de prueba
# Visitar http://localhost:3000/api/seed
```

5. **Iniciar servidor de desarrollo**

```bash
npm run dev
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
