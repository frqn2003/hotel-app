# 🚀 PRÓXIMOS PASOS INMEDIATOS (TypeScript)

## 📅 ESTA SEMANA (30 SEP - 4 OCT)

### ✅ DÍA 1 (HOY - 30 SEP)
1. **Revisar la documentación creada**
   - Lee `GUIA_PARA_PRINCIPIANTES.md`
   - Lee `MEJORAS_AL_PLAN.md`
   - Familiarízate con las tecnologías

2. **Instalar software necesario**
   ```bash
   # Node.js v18+
   node --version  # Verificar
   
   # Git
   git --version  # Verificar
   ```

3. **Crear cuentas gratuitas**
   - [ ] GitHub → https://github.com/signup
   - [ ] MongoDB Atlas → https://www.mongodb.com/cloud/atlas
   - [ ] Vercel → https://vercel.com/signup

---

### 🔧 DÍA 2 (1 OCT)

**Integrante 1: Crear el proyecto**
```bash
# 1. Crear proyecto Next.js con TypeScript
npx create-next-app@latest hotel-app
# Responder: 
# YES a TypeScript 
# YES a ESLint
# YES a Tailwind
# YES a src/ directory
# YES a App Router

# 2. Entrar al proyecto
cd hotel-app

# 3. Instalar dependencias
npm install mongoose next-auth react-icons
npm install nodemailer stripe react-leaflet leaflet
npm install date-fns react-hot-toast

# 4. Instalar types de TypeScript
npm install @types/leaflet @types/nodemailer --save-dev

# 5. Probar que funcione
npm run dev
# Abrir http://localhost:3000
```

**Integrante 2: MongoDB Atlas**
```
1. Crear cuenta en MongoDB Atlas
2. Crear cluster gratuito (elegir región cercana)
3. Database Access → Crear usuario y contraseña (guardar)
4. Network Access → Add IP Address → 0.0.0.0/0 (permitir todos)
5. Clusters → Connect → Drivers → Copiar connection string
6. Guardar el string en un archivo temporal
```

---

### 💾 DÍA 3 (2 OCT)

**Integrante 1: Estructura básica**
- Crear `src/components/Navbar.tsx` 
- Modificar `src/app/layout.tsx`
- Crear `src/app/habitaciones/page.tsx`
- Test: navegar entre páginas

**Integrante 2: MongoDB Connection**
- Crear `.env.local` con variables
- Crear `src/lib/mongodb.ts` 
- Crear `src/models/Room.ts` con interface IRoom
- Test: endpoint `/api/habitaciones`

---

### 🧪 DÍA 4 (3 OCT)

**AMBOS: Primera integración**
- Crear endpoint `GET /api/habitaciones/route.ts`
- Conectar frontend con backend (con tipos)
- Agregar datos de prueba (seed)
- Verificar que se muestren habitaciones

**Checkpoint:**
```bash
# Debe funcionar:
http://localhost:3000/habitaciones
# Debe mostrar tarjetas de habitaciones

# Verificar tipos:
npx tsc --noEmit
# No debe mostrar errores
```

---

### 📦 DÍA 5 (4 OCT)

**AMBOS: Git y documentación**
```bash
# Inicializar Git
git init
git add .
git commit -m "feat: configuración inicial del proyecto con TypeScript"

# Crear repo en GitHub
# Conectar y subir
git remote add origin https://github.com/tu-usuario/hotel-app.git
git push -u origin main
```

**Documentar:**
- Actualizar README con progreso
- Anotar problemas encontrados
- Listar próximos pasos

---

## 🎯 CHECKLIST SEMANA 1

Al final de la semana debes tener:
- [x] Proyecto Next.js con TypeScript creado
- [x] Dependencias instaladas (incluidas @types)
- [x] MongoDB Atlas configurado
- [x] Navbar funcionando (.tsx)
- [x] Página de habitaciones básica con tipos
- [x] Conexión a MongoDB funcionando
- [x] Datos de prueba en la DB
- [x] Código en GitHub
- [x] Sin errores de TypeScript (`npx tsc --noEmit`)

---

## 📝 PLANTILLA .env.local

Crea este archivo en la raíz del proyecto:

```env
# MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/hotel-db?retryWrites=true&w=majority

# NextAuth (generar con: openssl rand -base64 32)
NEXTAUTH_SECRET=tu_clave_secreta_random_aqui
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (lo configurarás en semana 1-2)
GOOGLE_CLIENT_ID=pendiente
GOOGLE_CLIENT_SECRET=pendiente

# Stripe (modo test - lo configurarás en semana 4)
STRIPE_SECRET_KEY=pendiente

# Email (lo configurarás en semana 4)
EMAIL_USER=pendiente
EMAIL_PASSWORD=pendiente
```

**⚠️ IMPORTANTE:** Agregar `.env.local` al `.gitignore` (ya viene por defecto)

---

## 🆘 SI TIENES PROBLEMAS

### Error: Node.js no encontrado
```bash
# Descargar e instalar desde:
https://nodejs.org/
# Elegir versión LTS (Long Term Support)
```

### Error: MongoDB no conecta
- Verificar que copiaste bien el string de conexión
- Reemplazar `<password>` con tu contraseña real
- Verificar que agregaste 0.0.0.0/0 en Network Access

### Error: Cannot find module
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Errores de TypeScript
```bash
# Verificar errores sin ejecutar
npx tsc --noEmit

# Si marca errores pero funciona:
npm run dev  # TypeScript no impide ejecución en desarrollo
```

### Error: Type 'X' is not assignable to type 'Y'
- Lee el error completo - TypeScript te dice exactamente qué espera
- Pregúntale a la IA: "¿Cómo soluciono este error de TypeScript?"
- Agrega tipos explícitos: `const data: TipoEsperado = ...`

### Puerto 3000 en uso
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

---

## 📚 RECURSOS PARA ESTA SEMANA

### Videos (ver ANTES de codear)
1. Next.js 14 + TypeScript: https://www.youtube.com/watch?v=h2BcitZPMn4
2. MongoDB Atlas setup: https://www.youtube.com/watch?v=rPqRyYJmx2g
3. TypeScript en 5 minutos: https://www.youtube.com/watch?v=ahCwqrYpIuM

### Documentación
- Next.js Docs: https://nextjs.org/docs
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript + React: https://react-typescript-cheatsheet.netlify.app/

### Cheat Sheet
- Git básico: https://training.github.com/downloads/github-git-cheat-sheet/
- TypeScript Cheat Sheet: https://www.typescriptlang.org/cheatsheets

---

## 💬 COMUNICACIÓN EN EQUIPO

### Daily Standup (5 minutos diarios)
Cada día, compartir por WhatsApp/Discord:
1. ¿Qué hice ayer?
2. ¿Qué haré hoy?
3. ¿Tengo algún bloqueo?

### Commits
```bash
# Formato de commits
git commit -m "tipo: descripción corta"

# Ejemplos:
git commit -m "feat: agregar navbar con TypeScript"
git commit -m "fix: corregir tipos en Room interface"
git commit -m "docs: actualizar README"
git commit -m "types: agregar interfaces para API responses"
```

### Sincronización
```bash
# Antes de trabajar cada día
git pull origin main

# Al terminar el día
git add .
git commit -m "feat: descripción de lo hecho"
git push origin main
```

---

## 🎓 TIPS DE APRENDIZAJE TYPESCRIPT

### Para los que saben JavaScript:
1. **TypeScript = JavaScript + tipos** - Si funciona en JS, funciona en TS
2. **Deja que el IDE te ayude** - VS Code sugiere tipos automáticamente
3. **Usa `interface` para objetos** - Es la forma más común
4. **No tipar TODO** - TypeScript infiere muchos tipos solo
5. **Los errores son tus amigos** - Te previenen bugs

### Tipos básicos que usarás constantemente:
```typescript
// Primitivos
const nombre: string = "Hotel";
const precio: number = 150;
const disponible: boolean = true;

// Arrays
const numeros: number[] = [1, 2, 3];
const nombres: Array<string> = ["Juan", "María"];

// Objetos (interfaces)
interface Habitacion {
  numero: number;
  precio: number;
  tipo: string;
}

// Funciones
function calcular(a: number, b: number): number {
  return a + b;
}

// Props de componentes
interface Props {
  titulo: string;
  precio: number;
}

function Card({ titulo, precio }: Props) {
  return <div>{titulo}: ${precio}</div>;
}

// Estados
const [count, setCount] = useState<number>(0);
const [data, setData] = useState<Habitacion[]>([]);

// Opcional con ?
interface User {
  nombre: string;
  email: string;
  telefono?: string;  
}
```

### Comandos TypeScript útiles:
```bash
# Ver errores de tipos
npx tsc --noEmit

# Ejecutar (TypeScript no impide ejecución en dev)
npm run dev

# Generar tipos automáticamente (VS Code)
# Ctrl + . (punto) sobre un error
```

---

## 📊 TRACKING DE PROGRESO

### Semana 1
```
Progreso esperado: 20%
- [ ] Configuración completa con TypeScript
- [ ] Primera página funcionando (.tsx)
- [ ] DB conectada con tipos (.ts)
- [ ] Código en GitHub
- [ ] Sin errores de tipos
```

### Indicadores de éxito:
✅ `npm run dev` funciona sin errores
✅ `npx tsc --noEmit` no muestra errores
✅ Puedes ver habitaciones en el navegador
✅ MongoDB Atlas tiene datos de prueba
✅ GitHub tiene tu código
✅ VS Code te sugiere propiedades de objetos (autocomplete)

---

## 🎯 META DE LA SEMANA 1

**"Tener un proyecto Next.js + TypeScript funcional que muestre habitaciones desde MongoDB con tipos definidos"**

Si logras esto, estás en el camino correcto para completar el proyecto a tiempo. 

---

## 📞 CANALES DE AYUDA

### Cuando estés trabado:
1. **Primero:** Lee el error completo de TypeScript
2. **Segundo:** Busca en Google: "nextjs typescript [tu error]"
3. **Tercero:** Revisa `GUIA_PARA_PRINCIPIANTES.md`
4. **Cuarto:** Pregunta a IA: "¿Cómo soluciono este error de tipos?"
5. **Quinto:** Stack Overflow (español)
6. **Último recurso:** Discord de Midudev o r/typescript

### Preguntas inteligentes:
❌ "TypeScript no funciona, ayuda"
✅ "Obtengo error 'Type string is not assignable to type number' en línea 42 de Room.tsx. Mi código es... ¿Qué tipo debería usar?"

---

## ✅ PARA MAÑANA (1 OCT)

**Tu única tarea HOY:**
1. Instalar Node.js (si no lo tienes)
2. Instalar VS Code (si no lo tienes)
3. Crear cuenta en GitHub
4. Crear cuenta en MongoDB Atlas
5. Leer `GUIA_PARA_PRINCIPIANTES.md` secciones 1-3
6. **Ver video de TypeScript en 5 minutos** (link arriba)

**Tiempo estimado:** 1.5-2 horas

---

## 🚀 VENTAJAS DE TYPESCRIPT PARA TU PROYECTO

### Lo que ganarás:
1. **Autocompletado increíble** - VS Code te sugiere todo
2. **Menos bugs tontos** - TypeScript detecta errores antes de ejecutar
3. **Mejor documentación** - Los tipos son documentación viva
4. **Facilita el trabajo en equipo** - Tu compañero sabe qué espera cada función
5. **Habilidad valiosa** - TypeScript está en todas las ofertas de trabajo

### Ejemplo real:
```typescript
// Sin TypeScript - fácil equivocarse
const room = await Room.findById(id);
console.log(room.precios);  

// Con TypeScript - error inmediato
const room = await Room.findById(id);
console.log(room.precios);  
console.log(room.precio);   
```

---

¡Éxito! TypeScript puede parecer complicado al principio, pero en 2-3 días te acostumbrarás. Recuerda: es JavaScript + ayuda extra. 
