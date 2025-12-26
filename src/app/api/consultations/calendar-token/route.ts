import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import crypto from "crypto";

const CALENDAR_SECRET =
  process.env.CALENDAR_SECRET || "default-secret-change-in-production";

function generateCalendarToken(userId: number): string {
  const data = `${userId}-${CALENDAR_SECRET}`;
  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")
    .substring(0, 32);
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const token = generateCalendarToken(userId);

    return NextResponse.json({
      token,
      userId,
    });
  } catch (error: any) {
    console.error("Error generating calendar token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
