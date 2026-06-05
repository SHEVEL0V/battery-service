import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "ua"] as const;
export type Locale = (typeof locales)[number];
const DEFAULT_LOCALE: Locale = "ua";

function getLocale(req: NextRequest): Locale {
  const cookieLocale = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) return cookieLocale as Locale;
  const browserLang = req.headers.get("accept-language")?.split(",")[0].split("-")[0] ?? "";
  if (locales.includes(browserLang as Locale)) return browserLang as Locale;
  return DEFAULT_LOCALE;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(req);
  req.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
