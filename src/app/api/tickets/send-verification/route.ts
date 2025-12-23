import { NextResponse } from "next/server";
import { Resend } from "resend";

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

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "isim@dsieron.pl",
      subject: "Potwierdź zgłoszenie - ISiM AGH",
      html: `
        <h2>Potwierdź swoje zgłoszenie</h2>
        <p>Email użytkownika: ${email}</p>
        <p>Kliknij poniższy link, aby potwierdzić i aktywować zgłoszenie:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Link wygasa po 24 godzinach.</p>
        <hr style="margin: 20px 0;" />
        <p>Możesz sprawdzić status swojego zgłoszenia w każdej chwili:</p>
        <a href="${statusUrl}">Sprawdź status zgłoszenia</a>
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
  } catch (error: any) {
    console.error(
      "Błąd podczas wysyłania emaila weryfikacyjnego:",
      error.message,
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
