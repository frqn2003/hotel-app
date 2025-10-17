-- Script para insertar habitaciones con comodidades
-- Ejecutar después de: npx prisma migrate reset --force

-- Limpiar tabla Room (por si acaso)
DELETE FROM "Room";

-- Resetear secuencia del ID
ALTER SEQUENCE "Room_id_seq" RESTART WITH 1;

-- Insertar habitaciones con todas sus comodidades
INSERT INTO "Room" (numero, tipo, estado, precio, capacidad, descripcion, comodidades, imagen, lat, lng) VALUES
(101, 'Simple', 'DISPONIBLE', 50000, 1, 'Habitación simple con cama individual y baño privado', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'], 
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', 30, 20),

(102, 'Doble', 'OCUPADA', 80000, 2, 'Habitación doble con dos camas individuales', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar'], 
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', 60, 20),

(103, 'Suite', 'DISPONIBLE', 150000, 2, 'Suite de lujo con sala de estar y jacuzzi', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar'], 
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 90, 20),

(201, 'Simple', 'MANTENIMIENTO', 50000, 1, 'Habitación simple con cama individual', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'], 
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', 30, 50),

(202, 'Doble', 'DISPONIBLE', 80000, 2, 'Habitación doble con cama matrimonial', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar'], 
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', 60, 50),

(203, 'Suite', 'DISPONIBLE', 150000, 3, 'Suite premium con balcón privado', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar', 'Balcón'], 
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 90, 50),

(301, 'Simple', 'DISPONIBLE', 55000, 1, 'Habitación simple en piso superior', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado'], 
 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400', 30, 80),

(302, 'Doble', 'OCUPADA', 85000, 2, 'Habitación doble con vista panorámica', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Vista panorámica'], 
 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400', 60, 80),

(303, 'Suite Presidencial', 'DISPONIBLE', 250000, 4, 'Suite presidencial con todas las comodidades', 
 ARRAY['WiFi', 'TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Jacuzzi', 'Vista al mar', 'Balcón', 'Cocina', 'Sala de reuniones'], 
 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 90, 80);

-- Verificar inserción
SELECT COUNT(*) as total_habitaciones FROM "Room";
SELECT * FROM "Room" ORDER BY numero;
