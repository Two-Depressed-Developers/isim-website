import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";
import { verifySession } from "@/lib/auth.utils";
import { changeUsernameSchema } from "@/lib/schemas";

type ErrorResponse = {
  error: string;
  code?: string;
};

export async function POST(req: Request) {
  const session = await verifySession();

  const body = await req.json();
  const parsed = changeUsernameSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json<ErrorResponse>(
      { error: "Błąd walidacji", code: "VALIDATION_ERROR" },
      { status: 422 },
    );
  }

  const { username } = parsed.data;

  try {
    const api = await getServerStrapiClient();
    await api.put(`/api/users/${session.user.id}`, {
      username,
    });

    return NextResponse.json({ success: true, username });
  } catch (error) {
    let status = 500;
    let errorMsg = "";

    if (axios.isAxiosError(error)) {
      status = error.response?.status ?? 500;
      errorMsg = error.response?.data?.error?.message || "";
    }

    let code = "CHANGE_USERNAME_FAILED";
    let message = "Nie udało się zmienić nazwy użytkownika";

    if (status === 400) {
      if (errorMsg.toLowerCase().includes("taken")) {
        code = "USERNAME_TAKEN";
        message = "Ta nazwa użytkownika jest już zajęta";
      }
    } else if (status === 422) {
      code = "VALIDATION_ERROR";
      message = "Błąd walidacji";
    }

    return NextResponse.json<ErrorResponse>(
      { error: message, code },
      { status },
    );
  }
}
