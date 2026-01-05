import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

const intlMiddleware = createIntlMiddleware(routing);

const authRoutes = ["/login"];
const panelPrefix = "/panel";

export default auth((req: NextRequest & { auth: Session | null }) => {
  const intlResponse = intlMiddleware(req);
  if (intlResponse.status !== 200) {
    return intlResponse;
  }

  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  const isPanelRoute = pathname.startsWith(panelPrefix);
  const isAuthRoute = authRoutes.includes(pathname);

  if (isPanelRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(panelPrefix, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|trpc|_vercel|.*\\..*).*)",
  ],
};
