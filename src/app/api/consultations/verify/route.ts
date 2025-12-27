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
      `${strapiUrl}/api/consultation-bookings?filters[verificationToken][$eq]=${token}&filters[reservationStatus][$eq]=unverified&populate=member`,
    );

    const bookings = findResponse.data.data;

    if (!bookings || bookings.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Nieprawidłowy lub wygasły token weryfikacyjny.",
        },
        { status: 404 },
      );
    }

    const booking = bookings[0];

    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    if (hoursDiff > 24) {
      return NextResponse.json(
        {
          success: false,
          error: "Link weryfikacyjny wygasł. Zarezerwuj nową konsultację.",
        },
        { status: 410 },
      );
    }

    const result = await axios.put(
      `${strapiUrl}/api/consultation-bookings/${booking.documentId}`,
      {
        data: {
          reservationStatus: "pending",
          verifiedAtTime: new Date().toISOString(),
          verificationToken: null,
        },
      },
    );

    return NextResponse.json({
      success: true,
      data: result.data,
      booking: {
        id: booking.documentId,
        studentName: booking.studentName,
        memberName: booking.member?.fullName,
        startTime: booking.startTime,
        endTime: booking.endTime,
      },
    });
  } catch (error: any) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Message:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("========================");

    return NextResponse.json(
      {
        success: false,
        error: "Wystąpił błąd podczas weryfikacji rezerwacji konsultacji",
      },
      { status: 500 },
    );
  }
}
