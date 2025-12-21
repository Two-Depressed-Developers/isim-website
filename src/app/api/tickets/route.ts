import { NextResponse } from "next/server";
import { Resend } from "resend";
import axios from "axios";
import crypto from "crypto";
import { getStrapiURL } from "@/lib/utils";
import type { TicketFormData } from "@/lib/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const strapiUrl = getStrapiURL();

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function POST(request: Request) {
  try {
    const data: TicketFormData = await request.json();
    const token = generateVerificationToken();

    await axios.post(`${strapiUrl}/api/tickets`, {
      data: {
        title: data.title,
        description: data.description,
        email: data.email,
        ticketStatus: "pending",
        verificationToken: token,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/helpdesk/verify?token=${token}`;

    // !! FOR NOW: Sending to verified Resend email only. Change to data.email after domain setup.
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "isim@dsieron.pl",
      subject: "Potwierdź zgłoszenie - ISiM AGH",
      html: `
        <h2>Potwierdź swoje zgłoszenie</h2>
        <p>Email użytkownika: ${data.email}</p>
        <p>Kliknij poniższy link, aby potwierdzić i aktywować zgłoszenie:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Link wygasa po 24 godzinach.</p>
      `,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Link weryfikacyjny został wysłany na podany adres e-mail. Sprawdź swoją skrzynkę.",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(
      "Błąd podczas tworzenia zgłoszenia:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      {
        success: false,
        error: "Wystąpił błąd podczas tworzenia zgłoszenia",
      },
      { status: error.response?.status || 500 },
    );
  }
}
