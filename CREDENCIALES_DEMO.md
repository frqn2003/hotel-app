# 🔑 Credenciales de Prueba - Demo

Este documento contiene las credenciales de los usuarios de prueba para testear todas las funcionalidades de la aplicación.

## 📋 Usuarios Disponibles

### 👤 Usuario Normal
**Para probar el panel de usuario y funcionalidades de cliente:**
- **Email:** `usuario@demo.com`
- **Contraseña:** `demo123`
- **Rol:** USUARIO
- **Panel:** Panel Usuario
- **Funcionalidades:**
  - Ver y reservar habitaciones
  - Personalizar reservas con extras
  - Simular pagos
  - Ver perfil y configuración
  - Enviar consultas

---

### 👨‍💼 Operador
**Para probar el panel de operaciones del hotel:**
- **Email:** `operador@demo.com`
- **Contraseña:** `operador123`
- **Rol:** OPERADOR
- **Panel:** Panel Operador
- **Funcionalidades:**
  - Dashboard operacional
  - Gestionar reservas (Check-in/Check-out)
  - Ver y generar facturas
  - Responder consultas de clientes
  - Ver habitaciones disponibles

---

### 👑 Administrador
**Para probar el panel de administración completo:**
- **Email:** `admin@demo.com`
- **Contraseña:** `admin123`
- **Rol:** ADMIN
- **Panel:** Panel Administrador
- **Funcionalidades:**
  - Dashboard administrativo completo
  - CRUD de habitaciones
  - Gestión de operadores
  - Consultas avanzadas
  - Reportes y estadísticas
  - Configuración del sistema

---

## 🚀 Cómo Usar

### Opción 1: Login Rápido (Recomendado)
1. Ve a `/auth/login`
2. Haz clic en cualquiera de los 3 usuarios de prueba mostrados
3. Serás redirigido automáticamente al panel correspondiente

### Opción 2: Login Manual
1. Ve a `/auth/login`
2. Ingresa el email y contraseña de cualquier usuario
3. Haz clic en "Iniciar Sesión"

---

## 📌 Notas Importantes

- **Frontend Only:** Esta es una aplicación frontend-only sin backend real
- **Datos Mock:** Todos los datos son simulados para demostración
- **Sin Persistencia:** Los cambios no se guardan permanentemente
- **LocalStorage:** Las sesiones se almacenan localmente en el navegador
- **Testing Seguro:** Puedes probar todas las funcionalidades sin riesgo

---

## 🔄 Cambiar de Usuario

Para cambiar de usuario mientras estás logueado:
1. Haz clic en tu perfil (esquina superior derecha)
2. Selecciona "Cerrar Sesión"
3. Vuelve a `/auth/login`
4. Selecciona otro usuario de prueba

---

## 📱 Paneles de Cada Rol

### Panel Usuario (`/`)
- Página principal con habitaciones
- Sistema de reservas
- Personalización de estadía
- Proceso de checkout
- Consultas y contacto

### Panel Operador (`/panel-operador`)
- Dashboard operacional
- Gestión de reservas del día
- Check-in y check-out
- Facturación
- Responder consultas

### Panel Admin (`/panel-admin`)
- Dashboard administrativo
- Gestión completa de habitaciones
- Administración de operadores
- Consultas y reportes
- Configuración del sistema

---

## 💡 Tips para Testing

1. **Prueba el flujo completo de reserva** como Usuario
2. **Gestiona las reservas** como Operador
3. **Administra el sistema** como Admin
4. **Cambia entre roles** para ver diferentes perspectivas
5. **Usa la consola del navegador** para ver logs de depuración

---

## 🆘 Solución de Problemas

### Si tienes errores de sesión:
```javascript
// En la consola del navegador:
localStorage.clear()
```
Luego vuelve a iniciar sesión.

### Si los datos no se cargan:
- Recarga la página (F5)
- Limpia el localStorage
- Verifica la consola del navegador

---

**Última actualización:** Noviembre 2024
**Versión:** 1.0.0 (Frontend-Only Demo)
