import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/auth/change-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Błąd zmiany hasła" },
        { status: res.status },
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
