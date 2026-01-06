import { NextResponse } from "next/server";
import axios from "axios";
import { getServerStrapiClient } from "@/lib/strapi-server";

export async function POST(req: Request) {
  try {
    const { token, password, passwordConfirmation } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token i hasło są wymagane" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Hasło musi mieć co najmniej 6 znaków" },
        { status: 400 },
      );
    }

    if (password !== passwordConfirmation) {
      return NextResponse.json(
        { error: "Hasła nie są zgodne" },
        { status: 400 },
      );
    }

    const apiKey = process.env.STRAPI_SECRET_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Błąd konfiguracji serwera" },
        { status: 500 },
      );
    }

    const api = await getServerStrapiClient();
    const { data } = await api.post(
      `/api/auth-custom/reset-password`,
      { token, password, passwordConfirmation },
      {
        headers: {
          "x-api-secret-key": apiKey,
        },
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Wystąpił błąd podczas resetowania hasła";
      const status = error.response?.status || 500;

      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd" },
      { status: 500 },
    );
  }
}
