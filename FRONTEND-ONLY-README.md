# 🏨 Hotel App - Frontend Only (Demo Visual)

## ⚠️ IMPORTANTE: Este es un Frontend Sin Backend

Este proyecto ha sido configurado como **SOLO FRONTEND** para deployment de demo visual. Todo el código backend ha sido eliminado o comentado.

## 🚫 Funcionalidades Deshabilitadas

El backend ha sido completamente removido. Las siguientes funcionalidades **NO están operativas**:

### Autenticación
- ❌ Login de usuarios
- ❌ Registro de usuarios
- ❌ Sesiones y autenticación

### Base de Datos
- ❌ Sin conexión a MongoDB/Prisma
- ❌ Sin persistencia de datos
- ❌ Sin queries a base de datos

### APIs Eliminadas
- ❌ `/api/login`
- ❌ `/api/register`
- ❌ `/api/habitaciones`
- ❌ `/api/reservas`
- ❌ `/api/contacto`
- ❌ `/api/contactos`
- ❌ `/api/pagos`
- ❌ `/api/facturas`
- ❌ Y todas las demás rutas API

### Servicios de Terceros
- ❌ Nodemailer (envío de emails)
- ❌ Stripe (procesamiento de pagos)
- ❌ NextAuth (autenticación OAuth)

## ✅ Lo Que SÍ Funciona

Este es un **demo visual completo** con:

- ✅ Interfaz de usuario completamente funcional
- ✅ Navegación entre páginas
- ✅ Componentes UI interactivos
- ✅ Estilos y animaciones con Tailwind CSS
- ✅ Mapas con Leaflet (con datos mock)
- ✅ Formularios visuales (sin envío real)
- ✅ Responsive design
- ✅ Datos mock para demostración visual

## 📦 Dependencias Eliminadas

Las siguientes dependencias backend fueron removidas del `package.json`:

```json
{
  "eliminadas": [
    "@prisma/client",
    "bcrypt",
    "bcryptjs",
    "next-auth",
    "nodemailer",
    "stripe",
    "prisma"
  ]
}
```

## 🗂️ Directorios Eliminados

- `src/app/api/` - Todas las rutas API
- `prisma/` - Schema y migraciones de base de datos
- `scripts/` - Scripts de seed y migración
- `src/lib/` - Conexión a Prisma
- `src/services/` - Servicios de backend
- `src/models/` - Modelos de datos
- `.env` - Variables de entorno (credenciales)

## 🗂️ Hooks Eliminados

- `src/hooks/useReservas.ts`
- `src/hooks/usePagos.ts`
- `src/hooks/useNotificaciones.ts`
- `src/hooks/useHabitaciones.ts`
- `src/hooks/useContacto.ts`
- `src/hooks/useActividades.ts`

## 🚀 Deployment

Este proyecto está optimizado para deployment en plataformas como:

- **Vercel** (recomendado para Next.js)
- **Netlify**
- **GitHub Pages** (con export estático)
- Cualquier hosting de frontend estático

### Comandos de Deployment

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 💡 Datos Mock

Las páginas usan datos de ejemplo (mock data) para mostrar la UI:

- **Habitaciones**: 3 habitaciones de ejemplo en `/habitaciones`
- **Formularios**: Muestran mensajes de éxito pero no envían datos
- **Autenticación**: Muestra UI pero no autentica realmente

## 🔄 Para Restaurar el Backend

Si necesitas restaurar el backend completo:

1. Busca los comentarios `/* Código original comentado */` en los archivos
2. Restaura los directorios eliminados desde el control de versiones
3. Reinstala las dependencias backend: `npm install`
4. Configura las variables de entorno en `.env`
5. Ejecuta las migraciones de Prisma

## 📝 Notas Técnicas

- **Framework**: Next.js 15.5.4
- **React**: 19.1.0
- **Styling**: Tailwind CSS 4
- **Iconos**: Lucide React
- **Mapas**: React Leaflet
- **Gráficos**: Recharts

---

**Fecha de Conversión a Frontend-Only**: Noviembre 2025  
**Propósito**: Demo visual para presentación/portafolio
