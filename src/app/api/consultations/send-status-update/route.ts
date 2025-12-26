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
        <h2>Konsultacja została zaakceptowana</h2>
        <p>Witaj ${studentName},</p>
        <p>Twoja prośba o konsultację z <strong>${memberName}</strong> została zaakceptowana.</p>
        <h3>Szczegóły spotkania:</h3>
        <ul>
          <li><strong>Data:</strong> ${formattedDate}</li>
          <li><strong>Godzina:</strong> ${formattedStartTime} - ${formattedEndTime}</li>
          ${room ? `<li><strong>Pokój:</strong> ${room}</li>` : ""}
        </ul>
        <p>Prosimy o punktualne przybycie.</p>
        <p>Pozdrawiamy,<br/>Zespół ISiM AGH</p>
      `;
    } else if (status === "declined") {
      subject = "Konsultacja odrzucona - ISiM AGH";
      html = `
        <h2>Konsultacja została odrzucona</h2>
        <p>Witaj ${studentName},</p>
        <p>Twoja prośba o konsultację z <strong>${memberName}</strong> została odrzucona.</p>
        <p>Prosimy o wybranie innego terminu lub skontaktowanie się bezpośrednio z prowadzącym.</p>
        <p>Pozdrawiamy,<br/>Zespół ISiM AGH</p>
      `;
    }

    await resend.emails.send({
      from: "onboarding@resend.dev",
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
  } catch (error: any) {
    console.error("Błąd podczas wysyłania emaila:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Błąd podczas wysyłania emaila",
      },
      { status: 500 },
    );
  }
}
