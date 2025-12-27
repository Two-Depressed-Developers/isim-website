import { verifySession } from "@/lib/auth.utils";
import { getServerStrapiClient } from "@/lib/strapi-server";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await verifySession();

  try {
    const api = await getServerStrapiClient();

    const res = await api.post("/api/auth-custom/unlink-account");

    if (res.status !== 200) {
      return NextResponse.json(
        { error: "Nie udało się rozłączyć" },
        { status: res.status },
      );
    } else {
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
