import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth-custom/unlink-account`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      },
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Nie udało się rozłączyć" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
