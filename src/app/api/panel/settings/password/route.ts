import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";
import { verifySession } from "@/lib/auth.utils";

type ErrorResponse = {
  error: string;
  code?: string;
};

export async function POST(req: Request) {
  await verifySession();

  const body = await req.json();
  const { currentPassword, newPassword, confirmPassword } = body;

  try {
    const api = await getServerStrapiClient();
    await api.post("/api/auth/change-password", {
      currentPassword,
      password: newPassword,
      passwordConfirmation: confirmPassword,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    let status = 500;
    let errorMsg = "";

    if (axios.isAxiosError(error)) {
      status = error.response?.status ?? 500;
      errorMsg = error.response?.data?.error?.message || "";
    }

    let code = "CHANGE_PASSWORD_FAILED";
    let message = "Nie udało się zmienić hasła";

    if (status === 400) {
      if (
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("does not match")
      ) {
        code = "INVALID_CURRENT_PASSWORD";
        message = "Aktualne hasło jest nieprawidłowe";
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
