import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { TicketStatus } from "@/lib/types";
import { getEmailForDev } from "@/lib/utils";

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

    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/helpdesk/ticket/${ticketId}`;

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
      from: "onboarding@resend.dev",
      to: recipientEmail,
      subject: subject,
      html: `
        ${message}
        <hr style="margin: 20px 0;" />
        <p>Szczegóły zgłoszenia:</p>
        <a href="${statusUrl}">Wyświetl zgłoszenie</a>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Email użytkownika: ${email}
        </p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email z aktualizacją statusu został wysłany",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      "Błąd podczas wysyłania emaila z aktualizacją statusu:",
      error.message,
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
