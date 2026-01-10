import { samlStrategy } from "@/lib/saml";
import { signIn } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let token: string | null = null;

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
        new URL("/login?error=SAMLValidationFailed", req.url),
      );
    }

    const profile = result.profile;

    const userData = {
      email: profile.nameID ?? "",
      groups: profile.groups ?? [],
    };

    console.log("SAML User Data:", userData);

    token = Buffer.from(JSON.stringify(userData)).toString("base64");
  } catch (error) {
    console.error("SAML Processing Error:", error);
    return NextResponse.redirect(
      new URL("/login?error=SAMLAuthFailed", req.url),
    );
  }

  if (token) {
    try {
      await signIn("saml-sso", {
        token: token,
        redirect: false,
      });
      return NextResponse.redirect(new URL("/panel/profile", req.url));
    } catch (error) {
      console.error("SSO SignIn Error:", error);

      return NextResponse.redirect(
        new URL("/login?error=AccessDenied", req.url),
      );
    }
  }

  return NextResponse.json({ success: true });
}
