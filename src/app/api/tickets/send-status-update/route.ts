import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEmailForDev } from "@/lib/utils";
import { getErrorMessage } from "@/lib/axios";
import { env } from "@ryankshaw/next-runtime-env";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, status, ticketId } = await request.json();

    if (!email || !status || !ticketId) {
      return NextResponse.json(
        { success: false, error: "Email, status i ticketId są wymagane" },
        { status: 400 },
      );
    }

    const statusUrl = `${env("NEXT_PUBLIC_APP_URL") || "http://localhost:3000"}/helpdesk/ticket/${ticketId}`;

    let subject = "";
    let message = "";

    if (status === "resolved") {
      subject = "Twoje zgłoszenie zostało rozwiązane - ISiM AGH";
      message = `
        <h2>Zgłoszenie rozwiązane</h2>
        <p>Twoje zgłoszenie zostało pomyślnie rozwiązane! Problem został usunięty.</p>
        <p>Dziękujemy za kontakt!</p>
      `;
    } else if (status === "closed") {
      subject = "Twoje zgłoszenie zostało odrzucone - ISiM AGH";
      message = `
        <h2>Zgłoszenie odrzucone</h2>
        <p>Twoje zgłoszenie zostało odrzucone.</p>
      `;
    } else {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy status" },
        { status: 400 },
      );
    }

    const recipientEmail = getEmailForDev("isim@dsieron.pl");

    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
      to: recipientEmail,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
            <h1 style="color: #2c3e50; margin-top: 0;">Aktualizacja statusu zgłoszenia</h1>
            
            <div style="background-color: #fff; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;">
              ${message}
            </div>
            
            <div style="background-color: #e8f4fd; border-radius: 5px; padding: 20px; margin: 25px 0;">
              <p style="margin: 5px 0; font-size: 14px;"><strong>Szczegóły zgłoszenia:</strong></p>
              <div style="text-align: center; margin-top: 15px;">
                <a href="${statusUrl}" 
                   style="background-color: #3498db; 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 5px; 
                          display: inline-block;
                          font-weight: bold;">
                  Wyświetl zgłoszenie
                </a>
              </div>
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
        message: "Email z aktualizacją statusu został wysłany",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Błąd podczas wysyłania emaila z aktualizacją statusu:",
      getErrorMessage(error),
    );

    return NextResponse.json(
      {
        success: false,
        error: "Wystąpił błąd podczas wysyłania emaila",
      },
      { status: 500 },
    );
  }
}
