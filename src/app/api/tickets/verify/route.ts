import { NextResponse } from "next/server";
import axios from "axios";
import { getStrapiURL } from "@/lib/utils";

const strapiUrl = getStrapiURL();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Token weryfikacyjny jest wymagany.",
        },
        { status: 400 },
      );
    }

    const findResponse = await axios.get(
      `${strapiUrl}/api/tickets?filters[verificationToken][$eq]=${token}&filters[ticketStatus][$eq]=pending`,
    );

    const tickets = findResponse.data.data;

    if (!tickets || tickets.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nieprawidłowy lub wygasły token weryfikacyjny.",
        },
        { status: 404 },
      );
    }

    const ticket = tickets[0];

    const createdAt = new Date(ticket.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json(
        {
          success: false,
          error: "Link weryfikacyjny wygasł. Utwórz nowe zgłoszenie.",
        },
        { status: 410 },
      );
    }

    const result = await axios.put(
      `${strapiUrl}/api/tickets/${ticket.documentId}`,
      {
        data: {
          ticketStatus: "open",
          verifiedAtTime: new Date().toISOString(),
          verificationToken: null,
        },
      },
    );

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Error:", error);
    console.error("========================");

    return NextResponse.json(
      {
        success: false,
        error: "Wystąpił błąd podczas weryfikacji zgłoszenia",
      },
      { status: 500 },
    );
  }
}
