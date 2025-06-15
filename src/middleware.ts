import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import type { NextRequest } from "next/server";
import type { Session } from "next-auth";

const authRoutes = ["/login"];
const panelPrefix = "/panel";

export default auth((req: NextRequest & { auth: Session | null }) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // console.log("Middleware auth:", JSON.stringify(req.auth, null, 2));

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

  // TODO: Zarzadzanie rolami i uprawnieniami
  // if (isLoggedIn && isPanelRoute) {
  //   const userRole = req.auth?.user?.role;

  //   if (userRole === 'StaffMember' && pathname !== `${panelPrefix}/profile`) {
  //     return NextResponse.redirect(new URL(`${panelPrefix}/profile`, req.url));
  //   }
  // }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
