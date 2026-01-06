import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { token, password, username } = await req.json();

    if (!token || !password || !username) {
      return NextResponse.json(
        { error: "Wszystkie pola są wymagane" },
        { status: 400 },
      );
    }

    const api = await getServerStrapiClient();
    const { data } = await api.post("/api/auth-custom/complete-registration", {
      token,
      password,
      username,
    });

    return NextResponse.json(data);
  } catch (error) {
    let message = "Błąd podczas rejestracji";
    let status = 400;

    if (axios.isAxiosError(error)) {
      message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        message;
      status = error.response?.status || 400;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
