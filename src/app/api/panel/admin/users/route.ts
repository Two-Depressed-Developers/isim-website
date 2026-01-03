import { requireAdmin } from "@/lib/auth.utils";
import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";

export async function POST(req: Request) {
  await requireAdmin();

  const body = await req.json();
  const { emails } = body;

  try {
    const api = await getServerStrapiClient();
    const { data } = await api.post("/api/admin-panel/bulk-create-users", {
      emails,
    });

    return NextResponse.json(data);
  } catch (error) {
    let message = "Błąd tworzenia użytkowników";
    let status = 500;

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        message;
      status = error.response?.status || 500;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
