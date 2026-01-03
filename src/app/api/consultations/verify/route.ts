import { NextResponse } from "next/server";
import axios from "axios";
import { getStrapiURL } from "@/lib/utils";
import type { ConsultationAvailability } from "@/types";

const strapiUrl = getStrapiURL();

function getBookingTimeDetails(isoString: string) {
  const date = new Date(isoString);
  const timeZone = "Europe/Warsaw";

  const dayOfWeek = date
    .toLocaleDateString("en-US", { weekday: "long", timeZone })
    .toLowerCase();

  const time = date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });

  return { dayOfWeek, time };
}

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
      `${strapiUrl}/api/consultation-bookings?filters[verificationToken][$eq]=${token}&filters[reservationStatus][$eq]=unverified&populate[member][populate]=consultationAvailability`,
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

    let newStatus = "pending";

    if (booking.member?.consultationAvailability) {
      const { dayOfWeek, time } = getBookingTimeDetails(booking.startTime);

      const matchingSlot = booking.member.consultationAvailability.find(
        (slot: ConsultationAvailability) => {
          if (!slot.isActive || slot.dayOfWeek !== dayOfWeek) return false;

          const start = slot.startTime.substring(0, 5);
          const end = slot.endTime.substring(0, 5);

          return time >= start && time < end;
        },
      );

      if (matchingSlot && matchingSlot.maxAttendees === null) {
        newStatus = "accepted";
      }
    }

    const result = await axios.put(
      `${strapiUrl}/api/consultation-bookings/${booking.documentId}`,
      {
        data: {
          reservationStatus: newStatus,
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
        status: newStatus,
      },
    });
  } catch (error) {
    console.error("=== VERIFICATION ERROR ===");
    console.error("Error:", error);
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
