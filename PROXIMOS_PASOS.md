# 🚀 PRÓXIMOS PASOS INMEDIATOS

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
# 1. Crear proyecto Next.js
npx create-next-app@latest hotel-app
# Responder: NO a TypeScript, YES a Tailwind, YES a App Router

# 2. Entrar al proyecto
cd hotel-app

# 3. Instalar dependencias
npm install mongoose next-auth react-bootstrap bootstrap
npm install react-icons nodemailer stripe react-leaflet leaflet
npm install date-fns react-hot-toast

# 4. Probar que funcione
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
- Crear `src/components/Navbar.js`
- Modificar `src/app/layout.js`
- Crear `src/app/habitaciones/page.js`
- Test: navegar entre páginas

**Integrante 2: MongoDB Connection**
- Crear `.env.local` con variables
- Crear `src/lib/mongodb.js`
- Crear `src/models/Room.js`
- Test: endpoint `/api/habitaciones`

---

### 🧪 DÍA 4 (3 OCT)

**AMBOS: Primera integración**
- Crear endpoint `GET /api/habitaciones`
- Conectar frontend con backend
- Agregar datos de prueba (seed)
- Verificar que se muestren habitaciones

**Checkpoint:**
```bash
# Debe funcionar:
http://localhost:3000/habitaciones
# Debe mostrar tarjetas de habitaciones
```

---

### 📦 DÍA 5 (4 OCT)

**AMBOS: Git y documentación**
```bash
# Inicializar Git
git init
git add .
git commit -m "feat: configuración inicial del proyecto"

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
- [x] Proyecto Next.js creado
- [x] Dependencias instaladas
- [x] MongoDB Atlas configurado
- [x] Navbar funcionando
- [x] Página de habitaciones básica
- [x] Conexión a MongoDB funcionando
- [x] Datos de prueba en la DB
- [x] Código en GitHub

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

**⚠️ IMPORTANTE:** Agregar `.env.local` al `.gitignore`

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

### Puerto 3000 en uso
```bash
# Usar otro puerto
npm run dev -- -p 3001
```

---

## 📚 RECURSOS PARA ESTA SEMANA

### Videos (ver ANTES de codear)
1. Next.js en 30 minutos: https://www.youtube.com/watch?v=h2BcitZPMn4
2. MongoDB Atlas setup: https://www.youtube.com/watch?v=rPqRyYJmx2g

### Documentación
- Next.js Docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Cheat Sheet
- Git básico: https://training.github.com/downloads/github-git-cheat-sheet/

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
git commit -m "feat: agregar navbar"
git commit -m "fix: corregir conexión mongodb"
git commit -m "docs: actualizar README"
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

## 🎓 TIPS DE APRENDIZAJE

### Para los que NO saben React:
1. **No entres en pánico** - Next.js hace todo más fácil
2. **Copia los ejemplos** de la guía primero
3. **Luego modifica** poco a poco para entender
4. **Console.log() es tu amigo** - úsalo para debug
5. **Lee los errores** - casi siempre dicen qué está mal

### Para aprender mientras haces:
```jsx
// 1. Empieza con componente simple
function MiComponente() {
  return <h1>Hola</h1>;
}

// 2. Agregar datos dinámicos
function MiComponente() {
  const nombre = "Juan";
  return <h1>Hola {nombre}</h1>;
}

// 3. Agregar props
function MiComponente({ nombre }) {
  return <h1>Hola {nombre}</h1>;
}

// 4. Agregar estado (si necesitas)
function MiComponente() {
  const [contador, setContador] = useState(0);
  return (
    <div>
      <p>Contador: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>+</button>
    </div>
  );
}
```

---

## 📊 TRACKING DE PROGRESO

### Semana 1
```
Progreso esperado: 20%
- [ ] Configuración completa
- [ ] Primera página funcionando
- [ ] DB conectada
- [ ] Código en GitHub
```

### Indicadores de éxito:
✅ `npm run dev` funciona sin errores
✅ Puedes ver habitaciones en el navegador
✅ MongoDB Atlas tiene datos de prueba
✅ GitHub tiene tu código

---

## 🎯 META DE LA SEMANA 1

**"Tener un proyecto Next.js funcional que muestre habitaciones desde MongoDB"**

Si logras esto, estás en el camino correcto para completar el proyecto a tiempo. 🎉

---

## 📞 CANALES DE AYUDA

### Cuando estés trabado:
1. **Primero:** Lee el error completo en la consola
2. **Segundo:** Busca en Google: "nextjs [tu error]"
3. **Tercero:** Revisa `GUIA_PARA_PRINCIPIANTES.md`
4. **Cuarto:** Pregunta en Stack Overflow (español)
5. **Último recurso:** Discord de Midudev o r/nextjs

### Preguntas inteligentes:
❌ "No funciona, ayuda"
✅ "Obtengo error 'Cannot find module mongoose' al correr npm run dev. Ya intenté npm install pero sigue fallando. Mi package.json es..."

---

## ✅ PARA MAÑANA (1 OCT)

**Tu única tarea HOY:**
1. Instalar Node.js (si no lo tienes)
2. Instalar VS Code (si no lo tienes)
3. Crear cuenta en GitHub
4. Crear cuenta en MongoDB Atlas
5. Leer `GUIA_PARA_PRINCIPIANTES.md` secciones 1-3

**Tiempo estimado:** 1-2 horas

---

¡Éxito! Recuerda que es NORMAL sentirse abrumado al principio. Toma un paso a la vez. 🚀
