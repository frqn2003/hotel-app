import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    try {
        const { reserva, datosPago, total } = await request.json()

        // Configurar el transporter de Nodemailer
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        // Crear el contenido del email
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; }
                    .reserva-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0; }
                    .total { font-size: 18px; font-weight: bold; color: #059669; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>¡Confirmación de Reserva!</h1>
                </div>
                <div class="content">
                    <h2>Hola ${datosPago.nombre},</h2>
                    <p>Tu reserva ha sido confirmada exitosamente. Aquí están los detalles:</p>
                    
                    <div class="reserva-info">
                        <h3>Detalles de la Reserva</h3>
                        <p><strong>Habitación:</strong> ${reserva.tipo}</p>
                        <p><strong>Check-in:</strong> ${new Date(reserva.fechaCheckin).toLocaleDateString()}</p>
                        <p><strong>Check-out:</strong> ${new Date(reserva.fechaCheckout).toLocaleDateString()}</p>
                        <p><strong>Noches:</strong> ${reserva.noches}</p>
                        <p><strong>Huéspedes:</strong> ${reserva.adultos} adultos, ${reserva.niños} niños</p>
                        <p class="total">Total Pagado: $${total.toLocaleString()}</p>
                    </div>

                    <div class="reserva-info">
                        <h3>Información del Huésped</h3>
                        <p><strong>Nombre:</strong> ${datosPago.nombre}</p>
                        <p><strong>Email:</strong> ${datosPago.email}</p>
                        <p><strong>Teléfono:</strong> ${datosPago.telefono}</p>
                    </div>

                    <p>¡Esperamos que disfrutes tu estadía!</p>
                    <p>Saludos cordiales,<br>El equipo del hotel</p>
                </div>
            </body>
            </html>
        `

        // Enviar email de confirmación
        await transporter.sendMail({
            from: `"Hotel App" <${process.env.SMTP_FROM}>`,
            to: datosPago.email,
            subject: 'Confirmación de Reserva - Hotel App',
            html: emailHtml,
        })

        // Aquí también podrías guardar la reserva en tu base de datos
        // await guardarReservaEnBD({ reserva, datosPago, total })
        const reservaConfirmada = {
    ...reserva,
    datosPago: datosPago,
    total: total,
    numeroConfirmacion: Math.random().toString(36).substr(2, 9).toUpperCase(),
    fechaReserva: new Date().toISOString()
}

       return NextResponse.json({ 
    success: true,
    message: 'Reserva confirmada y email enviado exitosamente',
    reservaId: 'temp-id', // En realidad sería el ID de la BD
    datosReserva: reservaConfirmada // Enviar datos de vuelta
})


    } catch (error) {
        console.error('Error al procesar el pago:', error)
        return NextResponse.json(
            { 
                success: false,
                error: 'Error al procesar la reserva' 
            },
            { status: 500 }
        )
    }
}