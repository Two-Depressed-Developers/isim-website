import { NextResponse } from "next/server";
import { getServerStrapiClient } from "@/lib/strapi-server";
import axios from "axios";

type VerifyTokenResponse = {
  valid: boolean;
  user: {
    id: number;
    email: string;
    username: string;
  };
};

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token jest wymagany" },
        { status: 400 },
      );
    }

    const api = await getServerStrapiClient();
    const { data } = await api.post<VerifyTokenResponse>(
      "/api/auth-custom/verify-confirmation-token",
      { token },
    );

    return NextResponse.json(data);
  } catch (error) {
    let message = "Nieprawidłowy lub wygasły token";
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
