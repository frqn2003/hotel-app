import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para validar teléfono
function validarTelefono(telefono: string): boolean {
  // Si está vacío, es válido (campo opcional)
  if (!telefono || telefono.trim() === '') return true
  // Si tiene contenido, debe tener al menos 7 caracteres numéricos
  const telefonoRegex = /^[\d\s\-\+\(\)]{7,}$/
  return telefonoRegex.test(telefono)
}

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

// Función para enviar email de confirmación al usuario
async function enviarConfirmacionAlUsuario(
  transporter: nodemailer.Transporter,
  nombre: string,
  email: string,
  asunto: string
) {
  await transporter.sendMail({
    from: `"Next Lujos Hotel" <${process.env.SMTP_USER}>`,
    to: email,
    subject: '✅ Hemos recibido tu mensaje - Next Lujos Hotel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">¡Gracias por contactarnos!</h2>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Hemos recibido tu mensaje con el asunto: <strong>"${asunto}"</strong></p>
        <div style="background: #f0fdf4; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #22c55e;">
          <p style="margin: 0; color: #166534;">
            Nos pondremos en contacto contigo lo antes posible. Generalmente respondemos dentro de 24 horas.
          </p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
          Si tienes más preguntas, no dudes en escribirnos nuevamente.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
        <p style="color: #64748b; font-size: 12px;">
          Next Lujos Hotel<br>
          Correo de confirmación automático - No responder a este email
        </p>
      </div>
    `,
  })
}

// Función para enviar email al hotel
async function enviarAlHotel(
  transporter: nodemailer.Transporter,
  nombre: string,
  email: string,
  telefono: string | undefined,
  asunto: string,
  mensaje: string
) {
  await transporter.sendMail({
    from: `"Website Next Lujos" <${process.env.SMTP_USER}>`,
    to: process.env.HOTEL_EMAIL || process.env.SMTP_USER,
    subject: `📧 Nuevo mensaje de contacto de ${nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nuevo mensaje de contacto</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 15px 0;">
          <p><strong>👤 Nombre:</strong> ${nombre}</p>
          <p><strong>📧 Email:</strong> ${email}</p>
          <p><strong>📞 Teléfono:</strong> ${telefono || 'No proporcionado'}</p>
          <p><strong>📋 Asunto:</strong> ${asunto}</p>
        </div>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 6px;">
          <p><strong>💬 Mensaje:</strong></p>
          <p>${mensaje.replace(/\n/g, '<br>')}</p>
        </div>
        <p style="margin-top: 20px; color: #64748b; font-size: 12px;">
          Mensaje enviado desde el formulario de contacto - Next Lujos Hotel
        </p>
      </div>
    `,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombre, email, telefono, asunto, mensaje, userId } = body

    console.log('Datos recibidos:', { nombre, email, telefono, asunto, mensaje: mensaje?.substring(0, 50) })

    // Validaciones
    if (!nombre || !email || !asunto || !mensaje) {
      const campos = { nombre: !!nombre, email: !!email, asunto: !!asunto, mensaje: !!mensaje }
      console.error('Validación fallida - Campos faltantes:', campos)
      const faltantes = Object.entries(campos)
        .filter(([_, value]) => !value)
        .map(([key]) => key)
      return NextResponse.json(
        { success: false, error: `Faltan campos obligatorios: ${faltantes.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error('Email inválido:', email)
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar teléfono si se proporciona
    if (telefono && !validarTelefono(telefono)) {
      console.error('Teléfono inválido:', telefono)
      return NextResponse.json(
        { success: false, error: 'Formato de teléfono inválido' },
        { status: 400 }
      )
    }

    // Crear registro en BD primero
    const nuevaConsulta = await prisma.contact.create({
      data: {
        nombre,
        email,
        telefono: telefono || null,
        asunto,
        mensaje,
        userId: userId || null,
        estado: 'PENDIENTE'
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    })

    // Enviar emails si está configurado SMTP
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = crearTransporter()
        await Promise.all([
          enviarAlHotel(transporter, nombre, email, telefono, asunto, mensaje),
          enviarConfirmacionAlUsuario(transporter, nombre, email, asunto)
        ])
      } catch (emailError) {
        console.error('Error al enviar emails:', emailError)
        // Continuar aunque falle el email
      }
    } else {
      console.warn('SMTP no configurado - Emails no serán enviados')
    }

    return NextResponse.json({
      success: true,
      data: nuevaConsulta,
      message: 'Consulta enviada exitosamente. Hemos enviado un email de confirmación a tu correo.'
    }, { status: 201 })

  } catch (error: unknown) {
    console.error('Error en contacto:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

// GET - Obtener todas las consultas (con filtros opcionales)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const estado = searchParams.get('estado') // PENDIENTE, EN_PROCESO, RESPONDIDO, CERRADO
    const userId = searchParams.get('userId')
    const operadorId = searchParams.get('operadorId')

    const where: any = {}

    if (estado) {
      where.estado = estado
    }
    if (userId) {
      where.userId = userId
    }
    if (operadorId) {
      where.operadorId = operadorId
    }

    const consultas = await prisma.contact.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      data: consultas,
      total: consultas.length
    })
  } catch (error) {
    console.error('Error al obtener consultas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las consultas' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}