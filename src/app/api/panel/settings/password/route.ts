import { verifySession } from "@/lib/auth.utils";
import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";

type ErrorResponse = {
  error: string;
  code?: string;
};

export async function POST(req: Request) {
  const session = await verifySession();

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
  } catch (error: any) {
    const status = error?.response?.status ?? 500;
    const errorData = error?.response?.data?.error;

    let code = "CHANGE_PASSWORD_FAILED";
    let message = "Nie udało się zmienić hasła";

    if (status === 400) {
      const errorMsg = errorData?.message || "";
      if (
        errorMsg.toLowerCase().includes("invalid") ||
        errorMsg.toLowerCase().includes("does not match")
      ) {
        code = "INVALID_CURRENT_PASSWORD";
        message = "Aktualne hasło jest nieprawidłowe";
      }
    } else if (status === 422) {
      code = "VALIDATION_ERROR";
      message = errorData?.message || "Błąd walidacji";
    }

    return NextResponse.json<ErrorResponse>(
      { error: message, code },
      { status },
    );
  }
}
