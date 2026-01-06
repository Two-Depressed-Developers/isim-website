import { NextResponse } from "next/server";
import axios from "axios";
import { getServerStrapiClient } from "@/lib/strapi-server";
import { getEmailForDev } from "@/lib/utils";
import { Resend } from "resend";
import { env } from "@ryankshaw/next-runtime-env";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendResetPasswordLink(email: string, token: string) {
  const setupUrl = `${env("NEXT_PUBLIC_APP_URL") || "http://localhost:3000"}/reset-password/${token}`;
  const recipientEmail = getEmailForDev(email);

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
    to: recipientEmail,
    subject: "Resetowanie hasła - ISiM AGH",
    html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
          <h1 style="color: #2c3e50; margin-top: 0;">Resetowanie hasła</h1>
          
          <p>Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta w systemie ISiM AGH.</p>
          
          <p>Aby ustawić nowe hasło, kliknij poniższy przycisk:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" 
               style="background-color: #3498db; 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Zresetuj hasło
            </a>
          </div>
          
          <p style="color: #7f8c8d; font-size: 14px;">
            Jeśli przycisk nie działa, skopiuj i wklej poniższy link do przeglądarki:
          </p>
          <p style="background-color: #ecf0f1; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
            ${setupUrl}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #e74c3c; font-weight: bold; margin-bottom: 10px;">Ważne informacje:</p>
            <ul style="color: #7f8c8d; font-size: 14px;">
              <li>Ten link wygaśnie po 1 godzinie</li>
              <li>Jeśli nie prosiłeś o reset hasła, zignoruj tę wiadomość</li>
              <li>Twoje hasło pozostanie niezmienione dopóki nie ustawisz nowego</li>
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
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400 },
      );
    }

    const apiKey = process.env.STRAPI_SECRET_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Błąd konfiguracji serwera" },
        { status: 500 },
      );
    }

    const api = await getServerStrapiClient();
    const { data } = await api.post(
      `/api/auth-custom/forgot-password`,
      { email },
      {
        headers: {
          "x-api-secret-key": apiKey,
        },
      },
    );

    if (data.success && data.token) {
      await sendResetPasswordLink(email, data.token);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;

      if (status === 404) {
        return NextResponse.json({ success: true });
      }

      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Wystąpił błąd podczas wysyłania emaila";

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd" },
      { status: 500 },
    );
  }
}
