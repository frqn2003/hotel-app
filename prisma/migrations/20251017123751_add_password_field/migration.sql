-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USUARIO', 'OPERADOR');

-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('DISPONIBLE', 'OCUPADA', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" "Role" NOT NULL DEFAULT 'USUARIO',
    "telefono" TEXT,
    "imagen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "estado" "RoomStatus" NOT NULL DEFAULT 'DISPONIBLE',
    "capacidad" INTEGER NOT NULL,
    "descripcion" TEXT,
    "comodidades" TEXT[],
    "imagen" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "fechaEntrada" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "huespedes" INTEGER NOT NULL,
    "precioTotal" DOUBLE PRECISION NOT NULL,
    "estado" "ReservationStatus" NOT NULL DEFAULT 'PENDIENTE',
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "notasEspeciales" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Room_numero_key" ON "Room"("numero");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
