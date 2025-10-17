import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, correo, password, passwordConfirmada } = body;

        // 1. VALIDACIONES
        if (!nombre || !correo || !password || !passwordConfirmada) {
            return NextResponse.json(
                { success: false, error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        if (password !== passwordConfirmada) {
            return NextResponse.json(
                { success: false, error: "Las contraseñas no coinciden" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EmailRegex.test(correo)) {
            return NextResponse.json(
                { success: false, error: "El correo electrónico no es válido" },
                { status: 400 }
            );
        }

        // 2. VERIFICAR SI EL USUARIO YA EXISTE
        const usuarioExistente = await prisma.user.findUnique({
            where: { email: correo }
        });

        if (usuarioExistente) {
            return NextResponse.json(
                { success: false, error: "El correo electrónico ya está registrado" },
                { status: 409 }
            );
        }

        // 3. HASHEAR LA CONTRASEÑA (TODO: implementar bcrypt)
        // const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password; // ⚠️ Temporal: sin hashear

        // 4. CREAR USUARIO EN LA BASE DE DATOS
        const nuevoUsuario = await prisma.user.create({
            data: {
                nombre,
                email: correo,
                password: hashedPassword,
                rol: 'USUARIO',
            }
        });

        // 5. RETORNAR USUARIO SIN CONTRASEÑA
        const { password: _passwordField, ...usuarioSinpassword } = nuevoUsuario;
        return NextResponse.json({
            mensaje: "Usuario registrado exitosamente",
            success: true,
            data: usuarioSinpassword
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return NextResponse.json(
            {
                mensaje: "Error al registrar el usuario",
                success: false,
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}