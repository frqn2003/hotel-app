# 🚀 Guía de Deployment a Producción

## Preparación Pre-Deploy

### 1. Verificar que Todo Funciona Localmente

```bash
# Verificar tipos TypeScript
npx tsc --noEmit

# Verificar lint
npm run lint

# Hacer build local
npm run build

# Probar build
npm start
```

### 2. Preparar Credenciales de Producción

**Antes de hacer deploy, ten listas:**
- ✅ Cuenta de Vercel
- ✅ Google OAuth credentials (configurados para producción)
- ✅ Cuenta de Stripe (modo producción o test)
- ✅ Email configurado para envío

---

## Deploy en Vercel (Paso a Paso)

### Paso 1: Preparar Repositorio

```bash
# Asegúrate de que todo está commiteado
git status

# Si hay cambios pendientes
git add .
git commit -m "Preparar para producción"
git push origin main
```

### Paso 2: Crear Proyecto en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Click en "Add New..." → "Project"
3. Selecciona tu repositorio de GitHub
4. Click en "Import"

### Paso 3: Configurar el Proyecto

Vercel detectará automáticamente Next.js:
- ✅ Framework Preset: Next.js
- ✅ Root Directory: ./
- ✅ Build Command: `next build`
- ✅ Output Directory: `.next`

Click "Deploy" (por ahora fallará, es normal)

### Paso 4: Crear Base de Datos

1. En tu proyecto de Vercel → Tab "Storage"
2. Click "Create Database"
3. Selecciona "Postgres" 
4. Selecciona el plan (Prisma Accelerate gratuito)
5. Click "Create"

**Vercel automáticamente:**
- ✅ Crea las variables `PRISMA_DATABASE_URL` y `POSTGRES_URL`
- ✅ Las conecta a tu proyecto

### Paso 5: Configurar Variables de Entorno Restantes

1. Ve a: Settings → Environment Variables
2. Agrega las siguientes variables:

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
EMAIL_USER=
EMAIL_PASSWORD=
```

**Valores importantes:**

**NEXTAUTH_SECRET:**
```bash
# Generar en tu terminal
openssl rand -base64 32
```

**NEXTAUTH_URL:**
```
https://tu-proyecto.vercel.app
```

**GOOGLE_CLIENT_ID y SECRET:**
- Ve a [Google Cloud Console](https://console.cloud.google.com)
- APIs & Services → Credentials
- Agregar URL de callback: `https://tu-proyecto.vercel.app/api/auth/callback/google`

**STRIPE_SECRET_KEY:**
- Para test: `sk_test_...` desde [dashboard.stripe.com](https://dashboard.stripe.com)
- Para producción: `sk_live_...`

### Paso 6: Inicializar Base de Datos

Después del deploy exitoso:

1. Ve a tu app: `https://tu-proyecto.vercel.app`
2. Visita: `https://tu-proyecto.vercel.app/api/seed`
3. Verifica que se cargaron los datos

**Opcional:** Usa Prisma Studio para verificar
```bash
# Localmente, con las URLs de producción en .env
npx prisma studio
```

### Paso 7: Verificar Funcionamiento

Prueba todas las funcionalidades:
- [ ] Página principal carga
- [ ] Ver habitaciones
- [ ] Login con Google
- [ ] Crear reserva
- [ ] Procesar pago (modo test)
- [ ] Enviar email

---

## Configuración de Dominios Personalizados

### Agregar Dominio Propio (Opcional)

1. Vercel → Settings → Domains
2. Agregar tu dominio: `www.tuhotel.com`
3. Configurar DNS según instrucciones de Vercel
4. **Actualizar variables de entorno:**
   - Cambiar `NEXTAUTH_URL` a `https://www.tuhotel.com`
   - Actualizar Google OAuth callback URLs

---

## Ambientes: Preview y Production

Vercel crea automáticamente:

### Production (main branch)
- URL: `https://tu-proyecto.vercel.app`
- Se despliega al hacer push a `main`

### Preview (otras branches)
- URL: `https://tu-proyecto-git-[branch].vercel.app`
- Se despliega automáticamente en cada PR

**Recomendación:** Usa la misma base de datos para preview y producción, O crea una DB separada para staging.

---

## Mantenimiento y Monitoreo

### Ver Logs en Tiempo Real

1. Vercel → Tu Proyecto → Functions
2. Click en cualquier función para ver logs
3. Útil para debugear errores en producción

### Analytics

Vercel → Analytics
- Visitas
- Performance
- Core Web Vitals

### Actualizar Aplicación

```bash
# Desarrollar localmente
git checkout -b feature/nueva-funcionalidad

# Hacer cambios y probar
npm run dev

# Commit y push
git add .
git commit -m "Agregar nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear Pull Request en GitHub
# Vercel creará un Preview Deploy automáticamente

# Después de aprobar, merge a main
# Vercel desplegará a producción automáticamente
```

---

## Backup de Base de Datos

### Exportar Base de Datos

```bash
# Requiere PostgreSQL instalado localmente
pg_dump [POSTGRES_URL] > backup.sql
```

### Restaurar Base de Datos

```bash
psql [POSTGRES_URL] < backup.sql
```

**Alternativa:** Usa Vercel Backups (disponible en planes pagos)

---

## Rollback en Caso de Error

1. Vercel → Deployments
2. Encuentra el deployment anterior que funcionaba
3. Click en los 3 puntos → "Promote to Production"

---

## Seguridad en Producción

### Checklist de Seguridad

- [ ] `.env.local` NO está en el repositorio
- [ ] Secrets en Vercel están configurados correctamente
- [ ] Google OAuth callback URLs incluyen solo dominios confiables
- [ ] Stripe está en modo test (hasta estar listo para cobros reales)
- [ ] NEXTAUTH_SECRET es fuerte y único
- [ ] Base de datos tiene backups configurados

### CORS y Headers

Next.js maneja esto automáticamente, pero verifica en `next.config.ts` si necesitas configuraciones especiales.

---

## Costos Estimados

### Tier Gratuito (Vercel)
- ✅ 100 GB-hours de serverless function execution
- ✅ 100 GB de bandwidth
- ✅ Deploy ilimitados
- ✅ Prisma Accelerate: 512 MB de data cache

### Cuando Escalar
Si excedes el tier gratuito, Vercel Pro cuesta ~$20/mes

---

## Troubleshooting Producción

### Error: "Cannot connect to database"
- Verifica que `PRISMA_DATABASE_URL` esté configurada
- Ejecuta `npx prisma generate` localmente y haz redeploy

### Error: "NextAuth configuration error"
- Verifica `NEXTAUTH_URL` tenga la URL correcta de producción
- Verifica Google OAuth callbacks

### Error 500 en API Routes
- Revisa los logs en Vercel → Functions
- Verifica que todas las variables de entorno estén configuradas

### Build Falla
```bash
# Probar build localmente primero
npm run build
```

---

## Contacto y Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Next.js Docs:** https://nextjs.org/docs
