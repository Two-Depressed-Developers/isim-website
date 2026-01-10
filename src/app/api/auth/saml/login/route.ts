import { samlStrategy } from "@/lib/saml";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const loginUrl = await samlStrategy.getAuthorizeUrlAsync("", "", {});

    return NextResponse.redirect(loginUrl);
  } catch (err) {
    console.error("SAML Error:", err);
    return NextResponse.json(
      { error: "SAML configuration error" },
      { status: 500 },
    );
  }
}
