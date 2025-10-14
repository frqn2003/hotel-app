# 🏨 GUÍA PARA PRINCIPIANTES - PROYECTO HOTEL (TypeScript)

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
- Vercel (deploy + PostgreSQL)
- Google Cloud Console (login)
- Stripe (pagos)

---

## 2. CONFIGURACIÓN INICIAL

### Crear Proyecto

```bash
npx create-next-app@latest hotel-app

# Responder:
# TypeScript? YES
# ESLint? YES
# Tailwind CSS? YES
# src/ directory? YES
# App Router? YES
# Import alias? YES (@/*)
```

### Instalar Dependencias

```bash
cd hotel-app
npm install @prisma/client next-auth react-icons
npm install nodemailer stripe react-leaflet leaflet
npm install date-fns react-hot-toast
npm install prisma @types/leaflet @types/nodemailer --save-dev
```

### Variables de Entorno (.env.local)

```env
# Vercel Postgres (obtenidas automáticamente en Vercel)
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# Autenticación
NEXTAUTH_SECRET=clave_secreta_random
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=tu_google_id
GOOGLE_CLIENT_SECRET=tu_google_secret

# Servicios externos
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

```tsx
function MiComponente() {
  return <h1>Hola Mundo</h1>;
}
```

### ¿Qué es Next.js?

Framework sobre React que agrega:

- **Rutas automáticas** (cada archivo = página)
- **API Routes** (backend incluido)
- **Server rendering** (más velocidad)

### ¿Qué es TypeScript?

JavaScript + **tipos** = menos errores, mejor autocompletado.

```typescript
// JavaScript
function sumar(a, b) {
  return a + b;
}

// TypeScript
function sumar(a: number, b: number): number {
  return a + b;
}
```

### Conceptos Clave

**Props (propiedades) con tipos:**

```tsx
interface RoomCardProps {
  nombre: string;
  precio: number;
}

function RoomCard({ nombre, precio }: RoomCardProps) {
  return (
    <div>
      {nombre}: ${precio}
    </div>
  );
}
```

**State (estado) con tipos:**

```tsx
const [contador, setContador] = useState<number>(0);
```

**API Routes:**

```typescript
// app/api/habitaciones/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ data: [] });
}
```

---

## 4. PRIMEROS 3 DÍAS

### DÍA 1: Primera Página

**Crear Navbar:**

```tsx
// src/components/Navbar.tsx
import Link from "next/link";

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

```tsx
// src/app/layout.tsx
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotel App",
  description: "Sistema de reservas hoteleras",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

### DÍA 2: PostgreSQL con Prisma

**1. Configurar Vercel Postgres**

- Crear proyecto en https://vercel.com
- En tu proyecto → Storage → Create Database
- Seleccionar "Postgres"
- Las variables de entorno se generan automáticamente
- Copiar las variables a tu .env.local para desarrollo local

**2. Inicializar Prisma:**

```bash
npx prisma init
```

**3. Conexión (ya creado en src/lib/prisma.ts):**

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

**4. Schema de Prisma (prisma/schema.prisma):**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model Room {
  id            String        @id @default(cuid())
  numero        Int           @unique
  tipo          RoomType
  precio        Float
  estado        RoomStatus    @default(DISPONIBLE)
  capacidad     Int
  descripcion   String?
  imagen        String?
  lat           Float?
  lng           Float?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  reservations  Reservation[]
  
  @@map("rooms")
}

enum RoomType {
  SIMPLE
  DOBLE
  SUITE
}

enum RoomStatus {
  DISPONIBLE
  OCUPADA
  MANTENIMIENTO
}
```

**5. Generar cliente de Prisma:**

```bash
npx prisma generate
npx prisma db push
```

**6. API con Prisma:**

```typescript
// src/app/api/habitaciones/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const habitaciones = await prisma.room.findMany({
      orderBy: { numero: 'asc' }
    });
    return NextResponse.json({ success: true, data: habitaciones });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const habitacion = await prisma.room.create({
      data: body
    });
    return NextResponse.json(
      { success: true, data: habitacion },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
```

✅ **Test:** http://localhost:3000/api/habitaciones

---

### DÍA 3: Frontend con Datos

```tsx
// src/app/habitaciones/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Room } from "@prisma/client";

interface ApiResponse {
  success: boolean;
  data: Room[];
}

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/habitaciones")
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setHabitaciones(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Cargando...</div>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Habitaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {habitaciones.map((hab) => (
          <div key={hab.id} className="border rounded-lg p-4 shadow">
            <h3 className="text-xl font-bold">Habitación {hab.numero}</h3>
            <p className="text-gray-600">{hab.tipo}</p>
            <p className="text-2xl font-bold mt-2">${hab.precio}/noche</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded ${
                hab.estado === "DISPONIBLE" ? "bg-green-200" : "bg-red-200"
              }`}
            >
              {hab.estado}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
```

**Agregar datos de prueba con Prisma:**

```typescript
// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Limpiar datos existentes
    await prisma.room.deleteMany({});

    // Crear habitaciones de prueba
    await prisma.room.createMany({
      data: [
        {
          numero: 101,
          tipo: "SIMPLE",
          precio: 50,
          capacidad: 1,
          estado: "DISPONIBLE",
          descripcion: "Habitación simple con cama individual",
          lat: -34.6037,
          lng: -58.3816,
        },
        {
          numero: 102,
          tipo: "DOBLE",
          precio: 80,
          capacidad: 2,
          estado: "DISPONIBLE",
          descripcion: "Habitación doble con cama matrimonial",
          lat: -34.604,
          lng: -58.382,
        },
        {
          numero: 201,
          tipo: "SUITE",
          precio: 150,
          capacidad: 4,
          estado: "DISPONIBLE",
          descripcion: "Suite de lujo con vista panorámica",
          lat: -34.605,
          lng: -58.383,
        },
      ],
    });

    return NextResponse.json({
      success: true,
      mensaje: "3 habitaciones creadas",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

✅ **Test:**

1. Visita http://localhost:3000/api/seed
2. Ve a http://localhost:3000/habitaciones

---

## 5. GUÍA SEMANAL

### SEMANA 1: Base

- ✅ Completar Días 1-3
- Agregar modelos User y Reservation al schema de Prisma
- Configurar NextAuth básico
- Push a GitHub

**Actualizar Schema de Prisma (agregar User y Reservation):**

```prisma
// Agregar a prisma/schema.prisma

// Modelo de Usuario
model User {
  id            String        @id @default(cuid())
  nombre        String
  email         String        @unique
  password      String?
  rol           Role          @default(USUARIO)
  telefono      String?
  imagen        String?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  reservations  Reservation[]
  
  @@map("users")
}

// Modelo de Reserva
model Reservation {
  id                String            @id @default(cuid())
  userId            String
  roomId            String
  fechaEntrada      DateTime
  fechaSalida       DateTime
  huespedes         Int
  precioTotal       Float
  estado            ReservationStatus @default(PENDIENTE)
  pagado            Boolean           @default(false)
  notasEspeciales   String?
  createdAt         DateTime          @default(now())
  updatedAt         DateTime          @updatedAt
  
  user              User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  room              Room              @relation(fields: [roomId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([roomId])
  @@map("reservations")
}

enum Role {
  USUARIO
  OPERADOR
}

enum ReservationStatus {
  PENDIENTE
  CONFIRMADA
  CANCELADA
  COMPLETADA
}
```

**Después ejecutar:**

```bash
npx prisma generate
npx prisma db push
```

---

### SEMANA 2: UI Usuario

- Página listado habitaciones con filtros
- Formulario de reserva
- Validaciones
- Login/registro

**Validaciones:**

```typescript
// src/lib/validations.ts
export interface ReservaData {
  fechaEntrada: string;
  fechaSalida: string;
  huespedes: number;
  email: string;
  telefono?: string;
}

export interface ValidationResult {
  valido: boolean;
  errores: string[];
}

export function validarReserva(datos: ReservaData): ValidationResult {
  const errores: string[] = [];

  const hoy = new Date();
  const entrada = new Date(datos.fechaEntrada);
  const salida = new Date(datos.fechaSalida);

  if (entrada < hoy) {
    errores.push("Fecha inválida");
  }

  if (salida <= entrada) {
    errores.push("Salida debe ser después de entrada");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(datos.email)) {
    errores.push("Email inválido");
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

```tsx
// src/components/MapaHabitaciones.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Room } from "@prisma/client";

interface MapaHabitacionesProps {
  habitaciones: Room[];
}

export default function MapaHabitaciones({
  habitaciones,
}: MapaHabitacionesProps) {
  return (
    <MapContainer
      center={[-34.6037, -58.3816]}
      zoom={15}
      style={{ height: "500px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {habitaciones.map(
        (hab) =>
          hab.lat && hab.lng && (
            <Marker
              key={hab.id}
              position={[hab.lat, hab.lng]}
            >
              <Popup>Habitación {hab.numero}</Popup>
            </Marker>
          )
      )}
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

```typescript
// src/app/api/create-checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  try {
    const { monto, reservaId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Reserva Hotel" },
            unit_amount: monto * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/exito`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancelado`,
      metadata: { reservaId },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
```

**Email:**

```typescript
// src/lib/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function enviarEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
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

---

## 6. RECURSOS

### Documentación Oficial

- [Next.js](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Prisma](https://www.prisma.io/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutoriales TypeScript

- TypeScript para React: https://react-typescript-cheatsheet.netlify.app/
- TypeScript en 5 minutos: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html

### Tarjetas de Prueba Stripe

```
Éxito: 4242 4242 4242 4242
Falla: 4000 0000 0000 0002
```

### Tips TypeScript

1. **Usa `interface` para tipos de objetos**
2. **Deja que TypeScript infiera cuando sea obvio** (`const num = 5` no necesita `: number`)
3. **Usa `type` o `interface` para props de componentes**
4. **El IDE te ayuda** - si VS Code sugiere algo, probablemente esté bien
5. **No te frustres con errores de tipos** - son para ayudarte

### Extensiones VS Code

- ES7+ React/Redux/React-Native snippets
- Prettier
- ESLint
- Prisma (oficial)
- Tailwind CSS IntelliSense
- **TypeScript Hero** (para imports automáticos)

---

## PROBLEMAS COMUNES

**Error: Cannot find module**

```bash
npm install
```

**Error: Cannot find module '@prisma/client'**

```bash
npx prisma generate
```

**Prisma no conecta a la base de datos**

- Revisar POSTGRES_PRISMA_URL en .env.local
- Verificar que la base de datos esté creada en Vercel
- Ejecutar `npx prisma db push` para crear las tablas

**Error al hacer migraciones**

```bash
# Resetear base de datos (solo desarrollo)
npx prisma migrate reset

# O forzar sincronización del schema
npx prisma db push --force-reset
```

**Leaflet no muestra mapa**

```tsx
// Agregar en layout.tsx
import "leaflet/dist/leaflet.css";
```

**Errores de TypeScript pero funciona**

```bash
# TypeScript solo valida, no impide ejecución
npm run dev
```

---

## CHECKLIST SEMANAL

**Antes de cada commit:**

- [ ] Código funciona sin errores
- [ ] No hay errores de TypeScript (`npx tsc --noEmit`)
- [ ] Variables sensibles en .env.local
- [ ] `npm run dev` funciona
- [ ] `npx prisma generate` ejecutado si cambió el schema

**Antes de cada semana:**

- [ ] Backup de base de datos (exportar con `pg_dump` o usar backups de Vercel)
- [ ] Documentar cambios en README
- [ ] Revisar requisitos cumplidos
- [ ] Schema de Prisma actualizado (`npx prisma db push`)

---

¡Éxito con el proyecto!
