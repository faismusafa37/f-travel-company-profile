import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n/i18n-config";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    if (
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/admin") ||
      pathname.match(/\.(.*)$/) // static files like .png, .jpg
    ) {
      return NextResponse.next();
    }

    // Try to get locale from cookie, else use default
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
    const locale = cookieLocale && i18n.locales.includes(cookieLocale as any) 
      ? cookieLocale 
      : i18n.defaultLocale;

    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|admin|favicon.ico).*)"],
};
