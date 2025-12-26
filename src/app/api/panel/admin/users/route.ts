import { requireAdmin } from "@/lib/dal";
import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";

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
  } catch (error: any) {
    const message =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      "Błąd tworzenia użytkowników";

    return NextResponse.json(
      { error: message },
      { status: error?.response?.status || 500 },
    );
  }
}
