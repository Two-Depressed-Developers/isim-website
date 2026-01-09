import { getEmailForDev } from "@/lib/utils";
import { env } from "@ryankshaw/next-runtime-env";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, token, bookingId, studentName } = await request.json();

    if (!email || !token || !bookingId) {
      return NextResponse.json(
        { success: false, error: "Brakujące wymagane parametry" },
        { status: 400 },
      );
    }

    const verificationUrl = `${env("NEXT_PUBLIC_APP_URL")}/consultations/verify?token=${token}`;
    const recipientEmail = getEmailForDev(email);

    console.log("Sending verification email to:", recipientEmail);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
      to: recipientEmail,
      subject: "Potwierdź rezerwację konsultacji",
      html: `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
            <h1 style="color: #2c3e50; margin-top: 0;">Potwierdź rezerwację konsultacji</h1>
            
            <p>Witaj${studentName ? ` ${studentName}` : ""},</p>
            
            <p>Otrzymaliśmy Twoją prośbę o rezerwację konsultacji. Aby potwierdzić swoją rezerwację, kliknij poniższy przycisk:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #3498db; 
                        color: white; 
                        padding: 14px 28px; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        display: inline-block;
                        font-weight: bold;">
                Potwierdź rezerwację
              </a>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px;">
              Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
            </p>
            <p style="background-color: #ecf0f1; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
              ${verificationUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">Ważne informacje:</p>
              <ul style="color: #7f8c8d; font-size: 14px;">
                <li>Ten link weryfikacyjny wygaśnie po 24 godzinach</li>
                <li>Rezerwacja zostanie przekazana do prowadzącego dopiero po weryfikacji</li>
                <li>Jeśli nie rezerwowałeś konsultacji, zignoruj tę wiadomość</li>
              </ul>
            </div>
          </div>
          
          <p style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 20px;">
            Wiadomość wygenerowana automatycznie - nie odpowiadaj na ten email
          </p>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Nie udało się wysłać emaila weryfikacyjnego",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });
  } catch (error) {
    console.error("Send verification error:", error);
    const message = error instanceof Error ? error.message : "Wystąpił błąd";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
