# 🏨 Hotel App - Sistema de Reservas Hoteleras

Aplicación web frontend-only para gestión hotelera con Next.js, TypeScript y Tailwind CSS. Proyecto académico desarrollado para demostración visual con datos simulados (mock data).

> ⚠️ **NOTA IMPORTANTE:** Esta es una versión **frontend-only** sin backend real. Todos los datos son simulados para propósitos de demostración visual.

## 🚀 Tecnologías

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático y desarrollo robusto
- **Tailwind CSS** - Estilos modernos y responsivos
- **React Leaflet** - Mapas interactivos para ubicación de habitaciones
- **Lucide React** - Iconos modernos y ligeros
- **React Hot Toast** - Notificaciones elegantes
- **Mock Data** - Datos simulados para demostración

## 🔑 Usuarios de Prueba

La aplicación incluye 3 usuarios de prueba para explorar todas las funcionalidades:

### 👤 Usuario Normal
- **Email:** `usuario@demo.com`
- **Contraseña:** `demo123`
- **Panel:** Ver habitaciones, hacer reservas, contactar

### 👨‍💼 Operador
- **Email:** `operador@demo.com`
- **Contraseña:** `operador123`
- **Panel:** Gestionar reservas, check-in/out, facturas, consultas

### 👑 Administrador
- **Email:** `admin@demo.com`
- **Contraseña:** `admin123`
- **Panel:** CRUD habitaciones, gestión operadores, reportes

> 💡 **Tip:** En la página de login puedes hacer clic directamente en cualquier usuario para acceso rápido.
> 📄 Ver [CREDENCIALES_DEMO.md](./CREDENCIALES_DEMO.md) para más detalles.

## 📋 Requisitos Previos

- **Node.js 18+**
- **npm o yarn**

¡Eso es todo! No necesitas configurar base de datos ni servicios externos.

## 🛠️ Instalación y Ejecución

### 1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/hotel-app.git
cd hotel-app
```

### 2. **Instalar dependencias**

```bash
npm install
```

### 3. **Iniciar servidor de desarrollo**

```bash
npm run dev
```

### 4. **Abrir en el navegador**

Visita [http://localhost:3000](http://localhost:3000)

### 5. **Probar la aplicación**

Ve a [http://localhost:3000/auth/login](http://localhost:3000/auth/login) y usa las credenciales de prueba.

## 🎯 Inicio Rápido

```bash
# Instalación y ejecución en 3 comandos
git clone https://github.com/tu-usuario/hotel-app.git
cd hotel-app
npm install && npm run dev
```

Luego accede a `http://localhost:3000/auth/login` y haz clic en cualquier usuario de prueba.

## 📁 Estructura del Proyecto

```
hotel-app/
├── prisma/
│   ├── schema.prisma          # Schema de base de datos
│   └── migrations/            # Migraciones de base de datos
├── src/
│   ├── app/
│   │   ├── api/               # API Routes (RESTful endpoints)
│   │   │   ├── actividades/   # Check-in/Check-out
│   │   │   ├── auth/          # Login/Register
│   │   │   ├── consultas/     # Contacto y consultas
│   │   │   ├── habitaciones/  # CRUD habitaciones
│   │   │   ├── operadores/    # Gestión operadores
│   │   │   ├── pagos/         # Procesamiento Stripe
│   │   │   ├── reservas/      # CRUD reservas
│   │   │   └── usuarios/      # Gestión usuarios
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── panel-admin/       # Panel administrador
│   │   │   ├── habitaciones/  # Gestión completa habitaciones
│   │   │   ├── consultas/     # Consultas avanzadas
│   │   │   ├── reportes/      # Reportes financieros
│   │   │   ├── operadores/    # Gestión operadores
│   │   │   └── configuracion/ # Configuración sistema
│   │   ├── panel-operador/    # Panel operador hotel
│   │   │   ├── habitaciones/  # Vista mapa y estados
│   │   │   ├── gestionar-reservas/ # CRUD reservas
│   │   │   ├── facturacion/   # Procesar pagos
│   │   │   └── consultas/     # Responder clientes
│   │   ├── panel-usuario/     # Panel cliente final
│   │   │   ├── preferencias/  # Configuración usuario
│   │   │   └── seguridad/     # Cambiar contraseña
│   │   ├── habitaciones/      # Catálogo público habitaciones
│   │   ├── reserva/           # Flujo de reserva
│   │   ├── mis-reservas/      # Historial reservas
│   │   ├── contacto/          # Formulario contacto
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Página de inicio
│   ├── componentes/           # Componentes React reutilizables
│   │   ├── Habitaciones/      # Cards y listas habitaciones
│   │   ├── Reservas/          # Formularios reserva
│   │   ├── ui/                # Componentes UI base
│   │   ├── Navbar.tsx         # Navegación principal
│   │   ├── Footer.tsx         # Footer del sitio
│   │   └── Loading.tsx        # Estados de carga
│   ├── lib/
│   │   ├── prisma.ts          # Cliente de Prisma
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── email.ts           # Configuración Nodemailer
│   │   ├── stripe.ts          # Configuración Stripe
│   │   └── utils.ts           # Utilidades varias
│   ├── types/                 # Tipos TypeScript
│   │   ├── auth.ts            # Tipos autenticación
│   │   └── database.ts        # Tipos base de datos
│   └── hooks/                 # Custom React hooks
│       ├── useAuth.ts         # Hook de autenticación
│       └── useLocalStorage.ts # Hook storage local
├── public/                    # Archivos estáticos
│   ├── images/               # Imágenes del sitio
│   ├── icons/                # Iconos y favicons
│   └── favicon.ico           # Favicon principal
├── .env.local                 # Variables de entorno (no commitear)
├── .gitignore                 # Archivos ignorados por Git
├── next.config.js            # Configuración Next.js
├── tailwind.config.js        # Configuración Tailwind CSS
├── tsconfig.json             # Configuración TypeScript
├── package.json              # Dependencias y scripts
└── README.md                 # Documentación del proyecto
```

## 🎯 Funcionalidades Completas

### 🏠 Panel de Usuario (Cliente Final)
- ✅ **Catálogo de habitaciones** - Vista grid/lista con fotos y detalles
- ✅ **Búsqueda avanzada** - Filtrar por tipo, precio, capacidad, fechas
- ✅ **Sistema de reservas** - Flujo completo con confirmación
- ✅ **Historial de reservas** - Ver estado, modificar, cancelar
- ✅ **Consultas por email** - Contacto directo con el hotel
- ✅ **Autenticación completa** - Login/Registro con Google OAuth
- ✅ **Panel de preferencias** - Configuración personal
- ✅ **Seguridad** - Cambiar contraseña, datos personales

### 🛎️ Panel de Operador (Staff Hotel)
- ✅ **Mapa interactivo** - Ubicación y estado de habitaciones en tiempo real
- ✅ **Gestión completa de reservas** - Crear, editar, cancelar, check-in/out
- ✅ **Control de estados** - DISPONIBLE/OCUPADA/MANTENIMIENTO/LIMPIEZA
- ✅ **Procesamiento de pagos** - Integración Stripe completa
- ✅ **Sistema de consultas** - Responder emails de clientes
- ✅ **Dashboard estadístico** - Ocupación, ingresos, reservas del día
- ✅ **Facturación** - Generar facturas, procesar reembolsos
- ✅ **Actividades** - Registro de check-in/check-out

### 👑 Panel de Administrador (Management)
- ✅ **Gestión de habitaciones** - CRUD completo, crear/editar/eliminar
- ✅ **Consultas avanzadas** - Queries parametrizadas complejas
- ✅ **Reportes financieros** - Ingresos, ocupación, estadísticas detalladas
- ✅ **Gestión de operadores** - Crear/editar/eliminar staff
- ✅ **Configuración del sistema** - Precios, políticas, servicios
- ✅ **Exportación de datos** - JSON, CSV, reportes personalizados
- ✅ **Dashboard completo** - Métricas de negocio en tiempo real
- ✅ **Control total** - Acceso a todas las funcionalidades

### 🔧 Funcionalidades Técnicas
- ✅ **API RESTful completa** - Endpoints para todas las operaciones
- ✅ **Base de datos relacional** - PostgreSQL con Prisma ORM
- ✅ **Autenticación segura** - JWT, OAuth, encriptación bcrypt
- ✅ **Pagos integrados** - Stripe con webhooks
- ✅ **Email transaccional** - Nodemailer con plantillas
- ✅ **Mapas interactivos** - React Leaflet con coordenadas
- ✅ **Notificaciones toast** - Feedback al usuario
- ✅ **Responsive design** - Mobile-first con Tailwind CSS
- ✅ **TypeScript completo** - Type-safe en todo el stack
- ✅ **Validaciones frontend** - Formularios controlados
- ✅ **Manejo de errores** - Try-catch y mensajes amigables

## 🗄️ Modelos de Base de Datos

### User (Usuarios del Sistema)
```typescript
interface User {
  id: string
  nombre: string           // Nombre completo del usuario
  correo: string          // Email único (login)
  password?: string       // Contraseña encriptada (bcrypt)
  rol: 'USUARIO' | 'OPERADOR' | 'ADMINISTRADOR'
  telefono?: string       // Teléfono de contacto
  createdAt: Date
  updatedAt: Date
  reservas?: Reservation[] // Relación con reservas
}
```

### Room (Habitaciones del Hotel)
```typescript
interface Room {
  id: string
  numero: number          // Número único de habitación
  tipo: string            // SIMPLE, DOBLE, SUITE, etc.
  precio: number          // Precio por noche
  capacidad: number       // Máximo de huéspedes
  estado: 'DISPONIBLE' | 'OCUPADA' | 'MANTENIMIENTO' | 'LIMPIEZA'
  descripcion?: string    // Descripción detallada
  comodidades: string[]   // Array de servicios: ['WiFi', 'TV', 'AC']
  imagen?: string         // URL de imagen
  lat?: number           // Latitud para mapa
  lng?: number           // Longitud para mapa
  createdAt: Date
  updatedAt: Date
  reservas?: Reservation[] // Relación con reservas
}
```

### Reservation (Reservas de Clientes)
```typescript
interface Reservation {
  id: string
  habitacionId: string    // FK a Room
  usuarioId: string       // FK a User
  fechaEntrada: Date      // Check-in
  fechaSalida: Date       // Check-out
  numeroHuespedes: number // Cantidad de huéspedes
  precioTotal: number     // Costo total de la estancia
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA'
  estadoPago: 'PENDIENTE' | 'PAGADO' | 'REEMBOLSADO'
  paymentIntentId?: string // ID de pago Stripe
  createdAt: Date
  updatedAt: Date
  habitacion?: Room       // Relación con habitación
  usuario?: User          // Relación con usuario
}
```

### Contacto (Consultas de Clientes)
```typescript
interface Contacto {
  id: string
  nombre: string          // Nombre del consultante
  email: string           // Email de contacto
  asunto: string          // Asunto de la consulta
  mensaje: string         // Mensaje completo
  estado: 'PENDIENTE' | 'RESPONDIDA' | 'CERRADA'
  respuesta?: string      // Respuesta del operador
  createdAt: Date
  updatedAt: Date
}
```

### Pago (Registros de Pagos)
```typescript
interface Pago {
  id: string
  reservaId: string       // FK a Reservation
  monto: number           // Monto pagado
  estado: 'PENDIENTE' | 'COMPLETADO' | 'FALLIDO' | 'REEMBOLSADO'
  stripePaymentId: string // ID de pago en Stripe
  createdAt: Date
  updatedAt: Date
  reserva?: Reservation   // Relación con reserva
}
```

## 🧪 Comandos Útiles y Scripts

### Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Iniciar con puerto personalizado
npm run dev -- -p 3001

# Verificar tipos TypeScript
npm run type-check

# Linting del código
npm run lint

# Formatear código automáticamente
npm run format
```

### Base de Datos Prisma
```bash
# Generar cliente Prisma
npx prisma generate

# Sincronizar schema con DB (development)
npx prisma db push

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Resetear base de datos (cuidado: borra todo)
npx prisma migrate reset

# Ver datos en GUI
npx prisma studio

# Seed de datos de prueba
npx prisma db seed
```

### Producción
```bash
# Build optimizado para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificar build
npm run build:analyze
```

### Testing (futuro)
```bash
# Ejecutar tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 🚢 Deploy en Producción

### Deploy en Vercel (Recomendado)

#### 1. **Preparar Repositorio**
```bash
# Commit final con todos los cambios
git add .
git commit -m "Listo para deploy - Sistema hotelero completo"
git push origin main
```

#### 2. **Configurar Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `hotel-app`
4. Configura las variables de entorno en Vercel:
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`

#### 3. **Configurar Base de Datos**
1. En Vercel, ve a **Storage** → **Create Database**
2. Elige **PostgreSQL**
3. Copia las URLs de conexión a las variables de entorno
4. Ejecuta migraciones automáticamente en deploy

#### 4. **Deploy Automático**
```bash
# Vercel detectará automáticamente que es Next.js
# Build y deploy automático en cada push a main
```

### Deploy en Railway (Alternativa)

#### 1. **Configurar Railway**
```bash
# Instalar CLI de Railway
npm install -g @railway/cli

# Login y crear proyecto
railway login
railway new
```

#### 2. **Variables de Entorno**
```bash
# Configurar variables en Railway dashboard
railway variables set POSTGRES_PRISMA_URL="tu_url"
railway variables set NEXTAUTH_SECRET="tu_secret"
# ... otras variables
```

#### 3. **Deploy**
```bash
# Deploy automático
railway up
```

### Configuración de Dominio Personalizado

#### Vercel
```bash
# En Vercel dashboard → Settings → Domains
# Agrega tu dominio: hotel.tudominio.com
# Configura DNS según instrucciones de Vercel
```

#### Configuración SSL
- ✅ **Automático en Vercel** - Certificados SSL gratuitos
- ✅ **HTTPS por defecto** - Todas las peticiones seguras
- ✅ **Redirección automática** - HTTP → HTTPS

### Monitoreo y Logs

#### Vercel Analytics
```bash
# Activar en Vercel dashboard
# Métricas de visitas, rendimiento, errores
```

#### Logs de Producción
```bash
# Ver logs en tiempo real
vercel logs

# Logs de funciones serverless
vercel logs --filter=function
```

### Backups y Seguridad

#### Base de Datos
```bash
# Vercel Postgres incluye backups automáticos:
- Backup diario (7 días)
- Backup semanal (4 semanas)  
- Backup mensual (12 meses)
```

#### Variables de Entorno
```bash
# Nunca commitear .env.local
# Usar siempre variables de entorno del hosting
# Rotar claves secretas regularmente
```

## 📚 Documentación y Recursos

### 📋 Documentación del Proyecto
- **[README.md](./README.md)** - Documentación principal (este archivo)
- **[GUIA_PARA_PRINCIPIANTES.md](./GUIA_PARA_PRINCIPIANTES.md)** - Tutorial completo paso a paso
- **[plan_proyecto_hotel.txt](./plan_proyecto_hotel.txt)** - Planificación y cronograma
- **[SETUP_EQUIPO.md](./SETUP_EQUIPO.md)** - Guía para nuevos desarrolladores
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deploy detallado a producción

### 🔗 Enlaces Externos
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework React
- **[Prisma Documentation](https://www.prisma.io/docs)** - ORM para PostgreSQL
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Framework CSS
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - Tipado JavaScript
- **[Vercel Deployment](https://vercel.com/docs)** - Platform deployment
- **[Stripe API](https://stripe.com/docs/api)** - Procesamiento de pagos
- **[NextAuth.js](https://next-auth.js.org/)** - Autenticación completa
- **[React Leaflet](https://react-leaflet.js.org/)** - Mapas interactivos

### 🎓 Tutoriales y Guías
- **[Next.js Crash Course](https://www.youtube.com/watch?v=1tWRJ5iXZ7U)** - Tutorial completo
- **[Prisma Tutorial](https://www.prisma.io/docs/getting-started)** - Base de datos
- **[Tailwind CSS Tutorial](https://tailwindcss.com/course)** - Estilos modernos
- **[TypeScript con React](https://react-typescript-cheatsheet.netlify.app/)** - Tips TypeScript

### 🛠️ Herramientas de Desarrollo
- **[VS Code](https://code.visualstudio.com/)** - Editor recomendado
- **[Prisma Studio](https://www.prisma.io/studio)** - GUI para base de datos
- **[Postman](https://www.postman.com/)** - Testing de APIs
- **[Git](https://git-scm.com/)** - Control de versiones
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript

## 🎯 Flujo de Usuario Completo

### 🏠 Para Clientes (USUARIO)
1. **Registro/Login** → Acceso con email o Google OAuth
2. **Explorar Habitaciones** → Catálogo con fotos, precios, disponibilidad
3. **Filtrar y Buscar** → Por tipo, precio, fechas, capacidad
4. **Reservar** → Selección de fechas, confirmación, pago con Stripe
5. **Mis Reservas** → Historial, estados, cancelación, modificación
6. **Contacto** → Consultas directas al hotel
7. **Perfil** → Configuración personal, seguridad

### 🛎️ Para Staff (OPERADOR)
1. **Login Operador** → Acceso restringido al panel
2. **Dashboard** → Vista general del hotel, ocupación, ingresos
3. **Mapa de Habitaciones** → Estado visual en tiempo real
4. **Gestionar Reservas** → CRUD completo, check-in/out
5. **Procesar Pagos** → Stripe integrado, reembolsos
6. **Responder Consultas** → Email integrado, plantillas
7. **Reportes** → Estadísticas diarias, semanales, mensuales

### 👑 Para Administración (ADMINISTRADOR)
1. **Panel Completo** → Acceso total a todas las funcionalidades
2. **Gestión de Habitaciones** → Crear, editar, eliminar habitaciones
3. **Gestión de Operadores** → Crear staff, permisos, roles
4. **Reportes Financieros** → Ingresos, ocupación, análisis avanzado
5. **Consultas Avanzadas** → Queries parametrizadas complejas
6. **Configuración Sistema** → Precios, políticas, servicios
7. **Exportación Datos** → JSON, CSV, reportes personalizados

## 🔐 Seguridad y Mejores Prácticas

### 🛡️ Seguridad Implementada
- ✅ **Encriptación de contraseñas** - bcrypt con salt rounds
- ✅ **JWT tokens** - Sesiones seguras con expiración
- ✅ **OAuth 2.0** - Google OAuth seguro
- ✅ **Validación de inputs** - Sanitización en frontend y backend
- ✅ **CORS configurado** - Protección contra peticiones cruzadas
- ✅ **HTTPS forzado** - Todas las peticiones seguras
- ✅ **Variables de entorno** - Secrets seguros en servidor
- ✅ **SQL Injection protection** - Prisma ORM seguro

### 📊 Monitoreo y Performance
- ✅ **Analytics integrado** - Métricas de uso y rendimiento
- ✅ **Error boundaries** - Manejo elegante de errores
- ✅ **Loading states** - Feedback visual al usuario
- ✅ **Optimización de imágenes** - Lazy loading y optimización
- ✅ **Code splitting** - Bundle optimizado
- ✅ **Caching estratégico** - Mejora de rendimiento

## 🤝 Contribución y Desarrollo

### 📋 Cómo Contribuir
1. **Fork del repositorio** → Copia personal del proyecto
2. **Crear branch** → `git checkout -b feature/nueva-funcionalidad`
3. **Hacer cambios** → Desarrollo con buenas prácticas
4. **Testing** → Verificar funcionamiento correcto
5. **Commit** → `git commit -m "Add: nueva funcionalidad"`
6. **Push** → `git push origin feature/nueva-funcionalidad`
7. **Pull Request** → Revisión y merge al proyecto principal

### 🎯 Buenas Prácticas
- **TypeScript siempre** - Tipado estricto en todo el código
- **Componentes reutilizables** - DRY principle
- **Nombres descriptivos** - Variables, funciones, archivos
- **Comentarios útiles** - Documentar código complejo
- **Testing primero** - TDD cuando sea posible
- **Commits atómicos** - Cambios pequeños y descriptivos
- **Code reviews** - Revisión por pares obligatoria

## 📄 Licencia y Derechos

### 📜 Licencia MIT
```
MIT License

Copyright (c) 2025 Hotel App Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

### 👥 Autores y Contribuidores
- **[Tu Nombre]** - Desarrollador principal
- **[Equipo]** - Colaboradores y revisores

### 📅 Fecha de Entrega
- **Inicio del Proyecto**: 18 de Octubre de 2025
- **Fecha Límite**: 12 de Noviembre de 2025
- **Estado**: ✅ **COMPLETADO** - Sistema funcional y deployado

---

## 🎉 **¡Proyecto Completado con Éxito!**

**Sistema hotelero completo con todas las funcionalidades requeridas:**

- ✅ **Panel Usuario** - Reservas, consultas, perfil
- ✅ **Panel Operador** - Gestión diaria del hotel  
- ✅ **Panel Administrador** - Control total y reportes
- ✅ **API RESTful** - Endpoints completos y seguros
- ✅ **Base de Datos** - PostgreSQL con Prisma ORM
- ✅ **Pagos** - Stripe integrado y funcional
- ✅ **Email** - Nodemailer con plantillas
- ✅ **Mapas** - React Leaflet interactivo
- ✅ **Deploy** - Vercel listo para producción

**🚀 Listo para usar en producción!**
