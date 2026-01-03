import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEmailForDev } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, token, ticketId } = await request.json();

    if (!email || !token || !ticketId) {
      return NextResponse.json(
        { success: false, error: "Email, token i ticketId są wymagane" },
        { status: 400 },
      );
    }

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/helpdesk/verify?token=${token}`;
    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/helpdesk/ticket/${ticketId}`;

    const recipientEmail = getEmailForDev("isim@dsieron.pl");

    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
      to: recipientEmail,
      subject: "Potwierdź zgłoszenie - ISiM AGH",
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
            <h1 style="color: #2c3e50; margin-top: 0;">Potwierdź swoje zgłoszenie</h1>
            
            <p>Otrzymaliśmy Twoje zgłoszenie do HelpDesk. Aby je potwierdzić, kliknij poniższy przycisk:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #3498db; 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        font-weight: bold;">
                Potwierdź zgłoszenie
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
            </p>
            <p style="background-color: #ecf0f1; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
              ${verificationUrl}
            </p>
            
            <div style="background-color: #e8f4fd; border-radius: 5px; padding: 15px; margin-top: 25px;">
              <p style="margin: 5px 0; font-size: 14px;"><strong>Sprawdź status zgłoszenia:</strong></p>
              <p style="margin: 5px 0;">
                <a href="${statusUrl}" style="color: #3498db; text-decoration: none;">Zobacz status zgłoszenia</a>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">Ważne informacje:</p>
              <ul style="color: #7f8c8d; font-size: 14px;">
                <li>Ten link weryfikacyjny wygaśnie po 24 godzinach</li>
                <li>Zgłoszenie zostanie przekazane do rozpatrzenia dopiero po weryfikacji</li>
                <li>Jeśli to nie Ty wysłałeś to zgłoszenie, zignoruj tę wiadomość</li>
              </ul>
            </div>
          </div>
          
          <p style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 20px;">
            Email użytkownika: ${email}<br/>
            Wiadomość wygenerowana automatycznie - nie odpowiadaj na ten email
          </p>
        </body>
        </html>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Link weryfikacyjny został wysłany na podany adres e-mail. Sprawdź swoją skrzynkę.",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(
      "Błąd podczas wysyłania emaila weryfikacyjnego:",
      message,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Wystąpił błąd podczas wysyłania emaila weryfikacyjnego",
      },
      { status: 500 },
    );
  }
}
