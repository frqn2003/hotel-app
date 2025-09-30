# 🏨 GUÍA PARA PRINCIPIANTES - PROYECTO HOTEL

## 📚 TABLA DE CONTENIDO
1. [Software Necesario](#1-software-necesario)
2. [Configuración Inicial](#2-configuración-inicial)
3. [Conceptos Básicos React/Next.js](#3-conceptos-básicos)
4. [Primeros 3 Días](#4-primeros-3-días)
5. [Guía Semanal](#5-guía-semanal)
6. [Recursos](#6-recursos)

---

## 1. SOFTWARE NECESARIO

### Instalar
- **Node.js** v18+ → https://nodejs.org/
- **VS Code** → https://code.visualstudio.com/
- **Git** → https://git-scm.com/

### Cuentas Gratuitas
- GitHub (código)
- MongoDB Atlas (base datos)
- Vercel (deploy)
- Google Cloud Console (login)
- Stripe (pagos)

---

## 2. CONFIGURACIÓN INICIAL

### Crear Proyecto
```bash
npx create-next-app@latest hotel-app

# Responder:
# TypeScript? NO
# Tailwind CSS? YES
# App Router? YES
```

### Instalar Dependencias
```bash
cd hotel-app
npm install mongoose next-auth react-bootstrap bootstrap react-icons
npm install nodemailer stripe react-leaflet leaflet date-fns react-hot-toast
```

### Variables de Entorno (.env.local)
```env
MONGODB_URI=tu_mongodb_uri
NEXTAUTH_SECRET=clave_secreta_random
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=tu_google_id
GOOGLE_CLIENT_SECRET=tu_google_secret
STRIPE_SECRET_KEY=tu_stripe_key
EMAIL_USER=tu_email
EMAIL_PASSWORD=tu_password_app
```

### Git
```bash
git init
git add .
git commit -m "Inicio proyecto"
git remote add origin https://github.com/tu-usuario/hotel-app.git
git push -u origin main
```

---

## 3. CONCEPTOS BÁSICOS

### ¿Qué es React?
Biblioteca para crear interfaces con **componentes reutilizables**.

```jsx
function MiComponente() {
  return <h1>Hola Mundo</h1>;
}
```

### ¿Qué es Next.js?
Framework sobre React que agrega:
- **Rutas automáticas** (cada archivo = página)
- **API Routes** (backend incluido)
- **Server rendering** (más velocidad)

### Conceptos Clave

**Props (propiedades):**
```jsx
<RoomCard nombre="Suite" precio={150} />
```

**State (estado):**
```jsx
const [contador, setContador] = useState(0);
```

**API Routes:**
```javascript
// app/api/habitaciones/route.js
export async function GET() {
  return Response.json({ data: [] });
}
```

---

## 4. PRIMEROS 3 DÍAS

### DÍA 1: Primera Página

**Crear Navbar:**
```jsx
// src/components/Navbar.js
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex gap-6">
      <Link href="/">Inicio</Link>
      <Link href="/habitaciones">Habitaciones</Link>
      <Link href="/reservas">Reservas</Link>
    </nav>
  );
}
```

**Agregar al Layout:**
```jsx
// src/app/layout.js
import Navbar from '@/components/Navbar';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
```

✅ **Test:** Corre `npm run dev` → http://localhost:3000

---

### DÍA 2: MongoDB

**1. Configurar MongoDB Atlas**
- Crear cuenta en https://www.mongodb.com/cloud/atlas
- Crear cluster gratis
- Database Access → crear usuario
- Network Access → 0.0.0.0/0
- Copiar string de conexión

**2. Conexión:**
```javascript
// src/lib/mongodb.js
import mongoose from 'mongoose';

let cached = global.mongoose || { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}
```

**3. Schema de Habitación:**
```javascript
// src/models/Room.js
import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true },
  tipo: { type: String, required: true },
  precio: { type: Number, required: true },
  estado: { type: String, default: 'disponible' },
  capacidad: Number,
  descripcion: String,
  coordenadas: { lat: Number, lng: Number }
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);
```

**4. API:**
```javascript
// src/app/api/habitaciones/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Room from '@/models/Room';

export async function GET() {
  await dbConnect();
  const habitaciones = await Room.find({});
  return NextResponse.json({ success: true, data: habitaciones });
}
```

✅ **Test:** http://localhost:3000/api/habitaciones

---

### DÍA 3: Frontend con Datos

```jsx
// src/app/habitaciones/page.js
'use client';
import { useState, useEffect } from 'react';

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/habitaciones')
      .then(res => res.json())
      .then(data => {
        setHabitaciones(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Habitaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {habitaciones.map(hab => (
          <div key={hab._id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-bold">Habitación {hab.numero}</h3>
            <p className="text-gray-600">{hab.tipo}</p>
            <p className="text-2xl font-bold mt-2">${hab.precio}/noche</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded ${
              hab.estado === 'disponible' ? 'bg-green-200' : 'bg-red-200'
            }`}>
              {hab.estado}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
```

**Agregar datos de prueba (una sola vez):**
```javascript
// src/app/api/seed/route.js
import dbConnect from '@/lib/mongodb';
import Room from '@/models/Room';

export async function GET() {
  await dbConnect();
  await Room.deleteMany({});
  
  await Room.insertMany([
    { numero: 101, tipo: 'Simple', precio: 50, capacidad: 1, estado: 'disponible' },
    { numero: 102, tipo: 'Doble', precio: 80, capacidad: 2, estado: 'disponible' },
    { numero: 201, tipo: 'Suite', precio: 150, capacidad: 4, estado: 'disponible' }
  ]);
  
  return Response.json({ success: true });
}
```

✅ **Test:** 
1. Visita http://localhost:3000/api/seed
2. Ve a http://localhost:3000/habitaciones

---

## 5. GUÍA SEMANAL

### SEMANA 1: Base
- ✅ Completar Días 1-3
- Crear schemas User y Reservation
- Configurar NextAuth básico
- Push a GitHub

**Schema User:**
```javascript
const UserSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, unique: true },
  rol: { type: String, enum: ['usuario', 'operador'], default: 'usuario' }
});
```

**Schema Reservation:**
```javascript
const ReservationSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  habitacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  fechaEntrada: Date,
  fechaSalida: Date,
  precioTotal: Number,
  estado: { type: String, default: 'pendiente' }
});
```

---

### SEMANA 2: UI Usuario
- Página listado habitaciones con filtros
- Formulario de reserva
- Validaciones
- Login/registro

**Validaciones:**
```javascript
// src/lib/validations.js
export function validarReserva(data) {
  const errores = [];
  
  if (new Date(data.fechaEntrada) < new Date()) {
    errores.push('Fecha inválida');
  }
  
  if (data.fechaSalida <= data.fechaEntrada) {
    errores.push('Salida debe ser después de entrada');
  }
  
  return { valido: errores.length === 0, errores };
}
```

---

### SEMANA 3: Panel Operador
- Mapa con Leaflet
- CRUD reservas
- Cambiar estados de habitación
- Proteger rutas

**Mapa básico:**
```jsx
// src/components/MapaHabitaciones.js
'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapaHabitaciones({ habitaciones }) {
  return (
    <MapContainer center={[-34.6037, -58.3816]} zoom={15} style={{ height: '500px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {habitaciones.map(hab => (
        <Marker key={hab._id} position={[hab.coordenadas.lat, hab.coordenadas.lng]}>
          <Popup>Habitación {hab.numero}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
```

---

### SEMANA 4: APIs Externas
- Stripe (pagos)
- Nodemailer (emails)
- Formulario contacto

**Stripe:**
```javascript
// src/app/api/create-checkout/route.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const { monto } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Reserva Hotel' },
        unit_amount: monto * 100
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/exito`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cancelado`
  });
  
  return Response.json({ sessionId: session.id });
}
```

**Email:**
```javascript
// src/lib/email.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function enviarEmail(to, subject, html) {
  await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
}
```

---

### SEMANA 5: Deploy y Documentación
- Testing completo
- Deploy en Vercel
- Crear README con tecnologías
- Documentar APIs

**Deploy Vercel:**
```bash
npm install -g vercel
vercel login
vercel
```

**README básico:**
```markdown
# Hotel App

## Tecnologías
- Next.js 14
- MongoDB
- Tailwind CSS
- Stripe (pagos)
- Nodemailer (emails)
- Leaflet (mapas)

## Instalación
1. npm install
2. Copiar .env.example a .env.local
3. npm run dev

## APIs
- GET /api/habitaciones - Listar habitaciones
- POST /api/reservas - Crear reserva
- POST /api/pagos - Procesar pago
```

---

## 6. RECURSOS

### Documentación Oficial
- [Next.js](https://nextjs.org/docs)
- [MongoDB](https://university.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)

### Tutoriales
- Next.js: https://www.youtube.com/watch?v=wm5gMKuwSYk
- MongoDB: https://www.mongodb.com/languages/mern-stack-tutorial
- Leaflet: https://react-leaflet.js.org/

### Tarjetas de Prueba Stripe
```
Éxito: 4242 4242 4242 4242
Falla: 4000 0000 0000 0002
Fecha: Cualquier futura
CVC: Cualquier 3 dígitos
```

### Tips Importantes
1. **Commits frecuentes** → cada feature que funcione
2. **Console.log()** es tu mejor amigo para debug
3. **Lee los errores completos** → la solución suele estar ahí
4. **Pregunta en Discord/Stack Overflow** si te trabas >30 min
5. **No copies código sin entenderlo** → lee línea por línea

### Extensiones VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint
- MongoDB for VS Code
- Tailwind CSS IntelliSense

---

## 🚨 PROBLEMAS COMUNES

**Error: Cannot find module**
```bash
npm install
```

**MongoDB no conecta**
- Revisar MONGODB_URI en .env.local
- Verificar IP whitelisted en Atlas

**Leaflet no muestra mapa**
```jsx
// Agregar en layout.js
import 'leaflet/dist/leaflet.css';
```

**Stripe no procesa**
- Usar tarjetas de prueba
- Verificar STRIPE_SECRET_KEY

**Emails no llegan**
- Gmail: Usar App Password, no contraseña normal
- Verificar EMAIL_USER y EMAIL_PASSWORD

---

## ✅ CHECKLIST SEMANAL

**Antes de cada commit:**
- [ ] Código funciona sin errores
- [ ] Variables sensibles en .env.local (no en código)
- [ ] Comentarios en funciones complejas
- [ ] npm run dev funciona

**Antes de cada semana:**
- [ ] Backup de base de datos
- [ ] Documentar cambios en README
- [ ] Revisar requisitos cumplidos
- [ ] Probar en navegador diferente

---

¡Éxito con el proyecto! 🚀
