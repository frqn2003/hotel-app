import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const FilePathUsers = path.join(process.cwd(), "data", "usuarios.json");

interface Usuario {
    id: string;
    nombre: string;
    correo: string;
    password: string;
    rol: 'USUARIO' | 'OPERADOR';
    fecha_creacion: string;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { nombre, correo, password, passwordConfirmada } = body;
        const fecha_creacion = new Date().toISOString();
        const id = Date.now().toString();

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
        
        let usuarios: Usuario[] = [];
        try {
            const usuariosLeidos = JSON.parse(fs.readFileSync(FilePathUsers, "utf-8"));
            usuarios = usuariosLeidos;
        } catch (error) {
            usuarios = []
            console.error("Error al leer el archivo de usuarios:", error);

        }

        const usuarioExistente = usuarios.find((usuario) => usuario.correo === correo);
        if (usuarioExistente) {
            return NextResponse.json(
                { success: false, error: "El correo electrónico ya está registrado" },
                { status: 409 }
            );
        }

        const nuevoUsuario : Usuario = {
            id,
            nombre,
            correo,
            password,
            rol: 'USUARIO',
            fecha_creacion,
        };

        usuarios.push(nuevoUsuario);
        fs.writeFileSync(FilePathUsers, JSON.stringify(usuarios, null, 2), 'utf-8');

        const {password: _, ...usuarioSinpassword} = nuevoUsuario;

        return NextResponse.json({mensaje: "Usuario registrado exitosamente", success: true, data: usuarioSinpassword });
    } catch (error) {
        return NextResponse.json(
            {mensaje: "Error al registrar el usuario", success: false, error: (error as Error).message },
            { status: 400 }
        );
    }
}

/* import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await prisma.user.create({
            data: body,
        });
        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 400 }
        );
    }
} */