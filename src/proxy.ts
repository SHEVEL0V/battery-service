import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { decrypt } from "@/lib/auth/session";

const locales = ["uk", "en"];
const defaultLocale = "uk";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const headers = { "accept-language": acceptLanguage };
  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, locales, defaultLocale);
  } catch {
    return defaultLocale;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  const isAdminRoute = pathname.includes("/admin");
  const isAuthRoute = pathname.includes("/login");

  if (isAdminRoute || isAuthRoute) {
    const cookie = request.cookies.get("session")?.value;
    const session = await decrypt(cookie);

    if (isAdminRoute && !session?.userId) {
      return NextResponse.redirect(new URL("/uk/login", request.url));
    }
    if (isAuthRoute && session?.userId) {
      return NextResponse.redirect(new URL("/uk/admin", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|glb|gltf)).*)",
  ],
};
