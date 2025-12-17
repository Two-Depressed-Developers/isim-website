import { auth } from "@/lib/auth"; // NextAuth auth()
import { redirect } from "next/navigation";

const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const githubClientId = process.env.AUTH_GITHUB_ID!;
const githubClientSecret = process.env.AUTH_GITHUB_SECRET!;

export async function GET(req: Request) {
  const session = await auth();

  console.log("GitHub connect session:", session);

  if (!session?.accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: githubClientId,
      client_secret: githubClientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  console.log("GitHub token data:", tokenData);

  if (!tokenData.access_token) {
    console.error("GitHub token error:", tokenData);
    return new Response("OAuth error", { status: 400 });
  }

  const githubUserRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const githubUser = await githubUserRes.json();

  console.log("GitHub user data:", githubUser);

  const linkRes = await fetch(`${strapiApiUrl}/api/auth-custom/link-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({
      provider: "github",
      providerId: githubUser.id.toString(),
    }),
  });

  console.log("Link response:", linkRes);

  if (!linkRes.ok) {
    const err = await linkRes.text();
    console.error("Link error:", err);
    return new Response("Linking failed", { status: 500 });
  }

  redirect("/panel/settings?github=connected");
}
