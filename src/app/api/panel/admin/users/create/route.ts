import { requireAdmin } from "@/lib/auth.utils";
import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";
import { Resend } from "resend";
import { getEmailForDev } from "@/lib/utils";
import { env } from "@ryankshaw/next-runtime-env";

const resend = new Resend(process.env.RESEND_API_KEY);

type CreatedUser = {
  email: string;
  token: string;
};

type FailedEmail = {
  email: string;
  reason: string;
};

type StrapiResponse = {
  createdUsers: CreatedUser[];
  failedEmails: FailedEmail[];
};

async function sendAccountSetupEmail(email: string, token: string) {
  const setupUrl = `${env("NEXT_PUBLIC_APP_URL") || "http://localhost:3000"}/setup/${token}`;
  const recipientEmail = getEmailForDev(email);

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
    to: recipientEmail,
    subject: "Aktywuj swoje konto - ISiM AGH",
    html: `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
          <h1 style="color: #2c3e50; margin-top: 0;">Witaj w systemie ISiM AGH!</h1>
          
          <p>Twoje konto zostało utworzone. Aby je aktywować i ustawić hasło, kliknij poniższy przycisk:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${setupUrl}" 
               style="background-color: #3498db; 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      display: inline-block;
                      font-weight: bold;">
              Aktywuj konto
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
              <li>Ten link weryfikacyjny wygaśnie po 48 godzinach</li>
              <li>Po kliknięciu w link będziesz mógł ustawić swoją nazwę użytkownika i hasło</li>
              <li>Jeśli nie zakładałeś konta, zignoruj tę wiadomość</li>
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
  await requireAdmin();

  const body = await req.json();
  const { emails } = body;

  try {
    const api = await getServerStrapiClient();
    const { data } = await api.post<StrapiResponse>(
      "/api/admin-panel/bulk-create-users",
      { emails },
    );

    const emailResults: { email: string; sent: boolean; error?: string }[] = [];

    for (const user of data.createdUsers) {
      try {
        await sendAccountSetupEmail(user.email, user.token);
        emailResults.push({ email: user.email, sent: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        emailResults.push({ email: user.email, sent: false, error: message });
      }
    }

    return NextResponse.json({
      createdUsers: data.createdUsers.map((e) => e.email),
      failedEmails: data.failedEmails,
      emailResults,
    });
  } catch (error) {
    let message = "Błąd tworzenia użytkowników";
    let status = 500;

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        message;
      status = error.response?.status || 500;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
