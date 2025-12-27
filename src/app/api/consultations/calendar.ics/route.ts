import { NextResponse } from "next/server";
import { getStrapiURL, flattenAttributes } from "@/lib/utils";
import type { ConsultationBooking } from "@/lib/types";
import qs from "qs";
import axios from "axios";
import crypto from "crypto";

const baseAPIUrl = getStrapiURL();
const CALENDAR_SECRET =
  process.env.CALENDAR_SECRET || "default-secret-change-in-production";

function formatDateForICS(date: string): string {
  const d = new Date(date);
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateICS(bookings: ConsultationBooking[]): string {
  const now = new Date();
  const nowFormatted = formatDateForICS(now.toISOString());

  let ics = `BEGIN:VCALENDAR\r\n`;
  ics += `VERSION:2.0\r\n`;
  ics += `PRODID:-//ISiM AGH//Konsultacje//PL\r\n`;
  ics += `CALSCALE:GREGORIAN\r\n`;
  ics += `METHOD:PUBLISH\r\n`;

  bookings.forEach((booking) => {
    const startDate = formatDateForICS(booking.startTime);
    const endDate = formatDateForICS(booking.endTime);
    const createdDate = formatDateForICS(booking.createdAt);
    const uid = `${booking.documentId}@isim.agh.edu.pl`;

    const summary = escapeICS(`Konsultacje - ${booking.studentName}`);
    const description = escapeICS(
      `${booking.fieldAndSubject}\\nStudent: ${booking.studentName}\\nEmail: ${booking.studentEmail}`,
    );
    const location = booking.member?.room
      ? escapeICS(`Pokój ${booking.member.room}`)
      : "";

    ics += `BEGIN:VEVENT\r\n`;
    ics += `UID:${uid}\r\n`;
    ics += `DTSTAMP:${nowFormatted}\r\n`;
    ics += `DTSTART:${startDate}\r\n`;
    ics += `DTEND:${endDate}\r\n`;
    ics += `SUMMARY:${summary}\r\n`;
    if (description) {
      ics += `DESCRIPTION:${description}\r\n`;
    }
    if (location) {
      ics += `LOCATION:${location}\r\n`;
    }
    ics += `CREATED:${createdDate}\r\n`;
    ics += `STATUS:CONFIRMED\r\n`;
    ics += `SEQUENCE:0\r\n`;
    ics += `END:VEVENT\r\n`;
  });

  ics += `END:VCALENDAR\r\n`;

  return ics;
}

function generateCalendarToken(userId: number): string {
  const data = `${userId}-${CALENDAR_SECRET}`;
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 32);
}

function validateCalendarToken(token: string, userId: number): boolean {
  const expectedToken = generateCalendarToken(userId);
  return token === expectedToken;
}

async function fetchData(url: string) {
  const response = await axios.get(url);
  return flattenAttributes(response.data);
}

async function getMemberData(slug: string) {
  const url = new URL(`/api/members`, baseAPIUrl);
  url.search = qs.stringify({
    filters: {
      slug: {
        $eq: slug,
      },
    },
    fields: ["documentId", "fullName"],
  });

  const response = await fetchData(url.href);
  return response?.data?.[0] ?? null;
}

async function getMemberConsultationBookings(
  memberDocumentId: string,
): Promise<any[]> {
  const url = new URL("/api/consultation-bookings", baseAPIUrl);

  url.search = qs.stringify({
    filters: {
      member: {
        documentId: {
          $eq: memberDocumentId,
        },
      },
      reservationStatus: {
        $eq: "accepted",
      },
    },
    sort: ["startTime:asc"],
    populate: {
      member: {
        fields: ["fullName", "documentId", "room"],
      },
    },
  });

  const response = await fetchData(url.href);
  return response?.data ?? [];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const userId = searchParams.get("userId");

    if (!token || !userId) {
      return new NextResponse("Token and userId are required", { status: 400 });
    }

    const userIdNum = parseInt(userId, 10);
    if (isNaN(userIdNum)) {
      return new NextResponse("Invalid userId", { status: 400 });
    }

    if (!validateCalendarToken(token, userIdNum)) {
      return new NextResponse("Invalid token", { status: 401 });
    }

    const userResponse = await axios.get(
      `${baseAPIUrl}/api/users/${userIdNum}?fields=memberProfileSlug`,
    );

    const user = flattenAttributes(userResponse.data);
    const memberSlug = user.memberProfileSlug;

    if (!memberSlug) {
      return new NextResponse("Member profile not linked", { status: 404 });
    }

    const memberData = await getMemberData(memberSlug);

    if (!memberData?.documentId) {
      return new NextResponse("Member not found", { status: 404 });
    }

    const bookings = await getMemberConsultationBookings(memberData.documentId);

    const icsContent = generateICS(bookings);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Error generating calendar feed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
