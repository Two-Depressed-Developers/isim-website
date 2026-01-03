import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEmailForDev } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, studentName, memberName, startTime, endTime, status, room } =
      await request.json();

    if (
      !email ||
      !studentName ||
      !memberName ||
      !startTime ||
      !endTime ||
      !status
    ) {
      return NextResponse.json(
        { success: false, error: "Wszystkie pola są wymagane" },
        { status: 400 },
      );
    }

    const recipientEmail = getEmailForDev(email);

    const formattedDate = new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date(startTime));

    const formattedStartTime = new Intl.DateTimeFormat("pl-PL", {
      timeStyle: "short",
    }).format(new Date(startTime));

    const formattedEndTime = new Intl.DateTimeFormat("pl-PL", {
      timeStyle: "short",
    }).format(new Date(endTime));

    let subject = "";
    let html = "";

    if (status === "accepted") {
      subject = "Konsultacja zaakceptowana - ISiM AGH";
      html = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
            <h1 style="color: #2c3e50; margin-top: 0;">Konsultacja została zaakceptowana</h1>
            
            <p>Witaj ${studentName},</p>
            <p>Twoja prośba o konsultację z <strong>${memberName}</strong> została zaakceptowana.</p>
            
            <div style="background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 5px; padding: 20px; margin: 25px 0;">
              <p style="color: #155724; font-weight: bold; margin-top: 0;">✓ Zaakceptowano</p>
              <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
              <p style="margin: 8px 0;"><strong>Godzina:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
              ${room ? `<p style="margin: 8px 0;"><strong>Pokój:</strong> ${room}</p>` : ""}
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Prosimy o punktualne przybycie. W razie pytań lub konieczności przełożenia spotkania, skontaktuj się bezpośrednio z prowadzącym.
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 20px;">
            Pozdrawiamy,<br/>
            Zespół ISiM AGH<br/>
            Wiadomość wygenerowana automatycznie - nie odpowiadaj na ten email
          </p>
        </body>
        </html>
      `;
    } else if (status === "declined") {
      subject = "Konsultacja odrzucona - ISiM AGH";
      html = `
        <!DOCTYPE html>
        <html lang="pl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; border-radius: 10px; padding: 30px; margin: 20px 0;">
            <h1 style="color: #2c3e50; margin-top: 0;">Konsultacja została odrzucona</h1>
            
            <p>Witaj ${studentName},</p>
            <p>Twoja prośba o konsultację z <strong>${memberName}</strong> została niestety odrzucona.</p>
            
            <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 5px; padding: 20px; margin: 25px 0;">
              <p style="color: #721c24; font-weight: bold; margin-top: 0;">✗ Odrzucono</p>
              <p style="margin: 8px 0;"><strong>Data:</strong> ${formattedDate}</p>
              <p style="margin: 8px 0;"><strong>Godzina:</strong> ${formattedStartTime} - ${formattedEndTime}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="color: #7f8c8d; font-size: 14px;">
                Prosimy o wybranie innego terminu z dostępnych w kalendarzu lub skontaktowanie się bezpośrednio z prowadzącym w celu ustalenia alternatywnego terminu.
              </p>
            </div>
          </div>
          
          <p style="text-align: center; color: #95a5a6; font-size: 12px; margin-top: 20px;">
            Pozdrawiamy,<br/>
            Zespół ISiM AGH<br/>
            Wiadomość wygenerowana automatycznie - nie odpowiadaj na ten email
          </p>
        </body>
        </html>
      `;
    }

    await resend.emails.send({
      from: process.env.RESEND_EMAIL_FROM || "onboarding@resend.dev",
      to: recipientEmail,
      subject,
      html,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Email został wysłany",
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Błąd podczas wysyłania emaila";
    console.error("Błąd podczas wysyłania emaila:", message);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
