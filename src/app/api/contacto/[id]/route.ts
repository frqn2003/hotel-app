import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

// Función para crear transporter de email
function crearTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Función para enviar email de respuesta al usuario
async function enviarRespuestaAlUsuario(
  transporter: nodemailer.Transporter,
  nombreUsuario: string,
  emailUsuario: string,
  asunto: string,
  respuesta: string,
  nombreOperador: string
) {
  await transporter.sendMail({
    from: `"Next Lujos Hotel" <${process.env.SMTP_USER}>`,
    to: emailUsuario,
    subject: `📧 Respuesta a tu consulta: ${asunto}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Respuesta a tu consulta</h2>
        <p>Hola <strong>${nombreUsuario}</strong>,</p>
        <p>Nos complace informarte que hemos respondido a tu consulta sobre: <strong>"${asunto}"</strong></p>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #1e40af;"><strong>Respuesta:</strong></p>
          <p style="margin: 10px 0 0 0; color: #1e293b;">${respuesta.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          <strong>Atendido por:</strong> ${nombreOperador}
        </p>
        <p style="color: #64748b; font-size: 14px;">
          Si tienes más preguntas, no dudes en contactarnos nuevamente.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          Next Lujos Hotel<br>
          Correo automático - No responder a este email
        </p>
      </div>
    `,
  })
}

// GET - Obtener una consulta específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        const consulta = await prisma.contact.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        telefono: true
                    }
                },
                operador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        })

        if (!consulta) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            data: consulta
        })
    } catch (error) {
        console.error('Error al obtener consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al obtener la consulta' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// PUT - Responder o actualizar consulta
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await request.json()
        const { respuesta, estado, operadorId } = body

        // Verificar que la consulta existe
        const consultaExistente = await prisma.contact.findUnique({
            where: { id },
            include: {
                operador: {
                    select: {
                        nombre: true
                    }
                }
            }
        })

        if (!consultaExistente) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        // Actualizar la consulta
        const consultaActualizada = await prisma.contact.update({
            where: { id },
            data: {
                ...(respuesta && { respuesta }),
                ...(estado && { estado }),
                ...(operadorId && { operadorId })
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                },
                operador: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true
                    }
                }
            }
        })

        // Enviar email de respuesta si se proporcionó respuesta y el usuario tiene email
        if (respuesta && consultaActualizada.email) {
            try {
                const transporter = crearTransporter()
                const nombreOperador = consultaActualizada.operador?.nombre || 'Equipo Next Lujos'
                
                await enviarRespuestaAlUsuario(
                    transporter,
                    consultaActualizada.nombre,
                    consultaActualizada.email,
                    consultaActualizada.asunto,
                    respuesta,
                    nombreOperador
                )
            } catch (emailError) {
                console.error('Error al enviar email de respuesta:', emailError)
                // Continuar aunque falle el email
            }
        }

        return NextResponse.json({
            success: true,
            data: consultaActualizada,
            message: 'Consulta actualizada exitosamente'
        })
    } catch (error) {
        console.error('Error al actualizar consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al actualizar la consulta' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}

// DELETE - Eliminar consulta
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // Verificar que la consulta existe
        const consultaExistente = await prisma.contact.findUnique({
            where: { id }
        })

        if (!consultaExistente) {
            return NextResponse.json(
                { success: false, error: 'Consulta no encontrada' },
                { status: 404 }
            )
        }

        await prisma.contact.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Consulta eliminada exitosamente'
        })
    } catch (error) {
        console.error('Error al eliminar consulta:', error)
        return NextResponse.json(
            { success: false, error: 'Error al eliminar la consulta' },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}
