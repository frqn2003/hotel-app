import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, mensaje } = await request.json()

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Verificar variables de entorno
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json(
        { success: false, message: 'Error en la configuración del servidor' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email para el hotel
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

    return NextResponse.json({
      success: true,
      message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.'
    })

  } catch (error: unknown) {
    console.error('Error en contacto:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error al enviar el mensaje. Por favor, intenta nuevamente.' 
      },
      { status: 500 }
    )
  }
}

// Opcional: Bloquear otros métodos HTTP
export async function GET() {
  return NextResponse.json(
    { message: 'Método no permitido' },
    { status: 405 }
  )
}