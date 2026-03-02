import { NextResponse } from "next/server";
import { locales, defaultLocale } from "./i18n-config";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // 检查路径是否已包含语言前缀
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (hasLocale) return;

  // 无语言前缀，重定向到默认语言
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|public|api|favicon\\.ico|images|login|admin).*)"],
};
