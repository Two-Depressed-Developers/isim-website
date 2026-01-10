import { samlStrategy } from "@/lib/saml";
import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@ryankshaw/next-runtime-env";

export async function POST(req: NextRequest) {
  let token: string | null = null;
  const baseUrl = env("NEXT_PUBLIC_APP_URL") || "http://localhost:3000";
  console.log("Request URL: ", req.url);

  try {
    const formData = await req.formData();
    const SAMLResponse = formData.get("SAMLResponse");

    if (!SAMLResponse || typeof SAMLResponse !== "string") {
      return NextResponse.json(
        { error: "Missing SAMLResponse" },
        { status: 400 },
      );
    }

    const result = await samlStrategy.validatePostResponseAsync({
      SAMLResponse,
    });

    if (!result.profile) {
      return NextResponse.redirect(
        new URL("/login?error=SAMLValidationFailed", baseUrl),
      );
    }

    const profile = result.profile;

    const userData = {
      email: profile.nameID ?? "",
      groups: profile.groups ?? [],
    };

    token = Buffer.from(JSON.stringify(userData)).toString("base64");
  } catch (error) {
    console.error("SAML Processing Error:", error);
    return NextResponse.redirect(
      new URL("/login?error=SAMLAuthFailed", baseUrl),
    );
  }

  if (token) {
    try {
      await signIn("saml-sso", {
        token: token,
        redirect: false,
      });
      return NextResponse.redirect(new URL("/panel/profile", baseUrl));
    } catch (error) {
      console.error("SSO SignIn Error:", error);

      return NextResponse.redirect(
        new URL("/login?error=AccessDenied", baseUrl),
      );
    }
  }

  return NextResponse.json({ success: true });
}
