# 🔧 Configuración para Nuevos Desarrolladores

## Requisitos Previos
- Node.js 18+
- Git instalado
- Cuenta de GitHub

## Pasos de Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/[USUARIO]/hotel-app.git
cd hotel-app
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

**Contacta al líder del equipo para obtener las credenciales de desarrollo.**

```env
# Base de datos - Prisma Accelerate
PRISMA_DATABASE_URL="[SOLICITAR_AL_EQUIPO]"
POSTGRES_URL="[SOLICITAR_AL_EQUIPO]"

# Autenticación (pueden usar las mismas para desarrollo)
NEXTAUTH_SECRET="desarrollo_secret_key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="[SOLICITAR_AL_EQUIPO]"
GOOGLE_CLIENT_SECRET="[SOLICITAR_AL_EQUIPO]"

# Servicios externos (opcional en desarrollo)
STRIPE_SECRET_KEY="[SOLICITAR_AL_EQUIPO_O_CREAR_CUENTA_STRIPE_TEST]"
EMAIL_USER="[TU_EMAIL]"
EMAIL_PASSWORD="[TU_APP_PASSWORD]"
```

### 4. Generar Cliente de Prisma
```bash
npx prisma generate
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 6. (Opcional) Cargar Datos de Prueba
Visita: [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

---

## 🔄 Flujo de Trabajo Diario

1. **Antes de empezar:**
   ```bash
   git pull origin main
   npm install  # por si hay nuevas dependencias
   ```

2. **Crear rama para tu feature:**
   ```bash
   git checkout -b feature/nombre-feature
   ```

3. **Trabajar en tu código**

4. **Commit y push:**
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push origin feature/nombre-feature
   ```

5. **Crear Pull Request en GitHub**

---

## 📊 Comandos Útiles

### Prisma
```bash
# Ver base de datos (GUI)
npx prisma studio

# Sincronizar cambios del schema
npx prisma db push

# Generar cliente después de cambios
npx prisma generate

# Resetear base de datos (¡CUIDADO!)
npx prisma migrate reset
```

### Next.js
```bash
# Desarrollo
npm run dev

# Build
npm run build

# Verificar errores TypeScript
npx tsc --noEmit
```

---

## ⚠️ Reglas Importantes

1. **NUNCA** hacer commit de `.env.local`
2. **NUNCA** hacer push directo a `main`
3. **SIEMPRE** trabajar en una rama separada
4. **SIEMPRE** hacer pull antes de empezar a trabajar
5. **SIEMPRE** probar que el código funcione antes de hacer commit

---

## 🆘 Problemas Comunes

### Error: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Error: "Database not found"
Verifica las URLs en `.env.local`

### Error de tipos TypeScript
```bash
npx prisma generate
npm install
```

### Cambios en schema.prisma
```bash
npx prisma generate
npx prisma db push
```

---

## 📞 Contacto

Si tienes problemas, contacta a:
- **Líder del equipo:** [NOMBRE Y CONTACTO]
- **Canal de Discord/Slack:** [LINK]
