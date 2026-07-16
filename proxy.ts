import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  const isAdminPage = pathname.startsWith("/admin") && !isLoginPage;
  const isAdminApi = pathname.startsWith("/api/admin") && !isLoginApi;

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const authed = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (authed) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
