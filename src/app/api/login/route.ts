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
        const { correo, password, recordar } = body;

        if (!correo || !password) {
            return NextResponse.json(
                { success: false, error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        let usuarios: Usuario[] = [];
        try {
            const usuariosLeidos = JSON.parse(fs.readFileSync(FilePathUsers, "utf-8"));
            usuarios = usuariosLeidos;
        } catch (error) {
            return NextResponse.json(
                { mensaje: "No hay usuarios registrados", success: false },
                { status: 404 }
            );
        }
        // 3. BUSCAR USUARIO POR CORREO
        const usuario = usuarios.find((u) => u.correo === correo);
        if (!usuario) {
            return NextResponse.json(
                { mensaje: "Credenciales incorrectas", success: false },
                { status: 401 }
            );
        }
        // 4. VERIFICAR CONTRASEÑA
        // ⚠️ En producción usar bcrypt.compare()
        if (usuario.password !== password) {
            return NextResponse.json(
                { mensaje: "Credenciales incorrectas", success: false },
                { status: 401 }
            );
        }

        // 5. LOGIN EXITOSO / CERRAR SESIÓN
        const { password: _, ...usuarioSesion } = usuario;

        // Crear token simple (en producción usar JWT)
        const token = Buffer.from(JSON.stringify(usuarioSesion)).toString('base64');

        return NextResponse.json(
            {
                mensaje: "Login exitoso",
                success: true,
                usuario: usuarioSesion,
                token,
                recordar: recordar || false,
            },
            { status: 200 }
        );

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