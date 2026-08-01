import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "./app/i18n";

export function proxy(request: NextRequest) {
  const segment = request.nextUrl.pathname.split("/")[1] || "fr";
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-totube-locale", isLocale(segment) ? segment : "fr");
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
