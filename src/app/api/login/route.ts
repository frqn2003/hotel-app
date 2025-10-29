import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { correo, password, recordar } = body;
        
        console.log(' Intento de login:', { correo, recordar })
        
        // 1. VALIDAR CAMPOS REQUERIDOS
        if (!correo || !password) {
            console.log(' Campos faltantes')
            return NextResponse.json(
                { success: false, error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        // 2. BUSCAR USUARIO POR EMAIL EN LA BASE DE DATOS
        console.log('🔍 Buscando usuario con email:', correo)
        const usuario = await prisma.user.findUnique({
            where: { email: correo },
            select: {
                id: true,
                nombre: true,
                email: true,
                password: true,
                rol: true,
                telefono: true,
                imagen: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!usuario) {
            console.log('❌ Usuario no encontrado')
            return NextResponse.json(
                { mensaje: "Credenciales incorrectas", success: false },
                { status: 401 }
            );
        }

        console.log('✅ Usuario encontrado:', { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol })

        // 3. VERIFICAR CONTRASEÑA
        // TODO: En producción usar: const isValid = await bcrypt.compare(password, usuario.password);
        const isValid = usuario.password === password; // ⚠️ Temporal: sin hashear
        
        console.log('🔑 Verificando contraseña...', { passwordMatch: isValid })
        
        if (!isValid) {
            console.log('❌ Contraseña incorrecta')
            return NextResponse.json(
                { mensaje: "Credenciales incorrectas", success: false },
                { status: 401 }
            );
        }

        // 4. LOGIN EXITOSO / PREPARAR SESIÓN
        console.log('✅ Login exitoso')
        const { password: _passwordField, ...usuarioSesion } = usuario;

        // Crear token simple (en producción usar JWT)
        const token = Buffer.from(JSON.stringify(usuarioSesion)).toString('base64');

        // Configurar duración de la sesión según "Recordarme"
        // Si recordar=true -> 30 días, si no -> 1 día
        const maxAge = recordar ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // en segundos
        
        // Crear respuesta con cookie HTTP
        const response = NextResponse.json(
            {
                mensaje: "Login exitoso",
                success: true,
                usuario: usuarioSesion,
                token,
                recordar: recordar || false,
            },
            { status: 200 }
        );

        // Configurar cookie segura (HttpOnly para mayor seguridad)
        response.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: maxAge,
            path: '/'
        });

        return response;

    } catch (error) {
        console.error('Error en login:', error);
        return NextResponse.json(
            {
                mensaje: "Error interno del servidor",
                success: false,
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}