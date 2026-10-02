import { NextRequest, NextResponse } from "next/server";

/**
 * Subdomain → portfolio rewriting.
 *
 * لو ROOT_DOMAIN مضبوط (مثال: rasma.vercel.app أو rasma.com):
 *   hamza.rasma.vercel.app  →  /artist/hamza
 *   www.rasma.vercel.app    →  الرئيسية عادي
 *
 * لو مش مضبوط (تطوير محلي / معاينة): كله يمشي على /artist/[slug] عادي.
 */

const RESERVED = new Set([
  "www",
  "app",
  "admin",
  "api",
  "dashboard",
  "auth",
  "login",
  "register",
  "artists",
  "artist",
  "buy",
  "me",
  "rasma",
  "mail",
  "ftp",
  "blog",
  "help",
  "support",
  "cdn",
  "static",
  "assets",
]);

export function middleware(req: NextRequest) {
  const rootDomain = process.env.ROOT_DOMAIN;
  if (!rootDomain) return NextResponse.next();

  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();
  const root = rootDomain.toLowerCase().split(":")[0];

  if (host === root || host === `www.${root}`) return NextResponse.next();

  if (host.endsWith(`.${root}`)) {
    const slug = host.slice(0, host.length - root.length - 1);
    // الصفحة الرئيسية للـ subdomain فقط بتتحول لبورتفوليو الفنان
    // (باقي المسارات زي /buy/xxx تمشي على الموقع الأساسي)
    if (slug && !RESERVED.has(slug) && !slug.includes(".")) {
      const url = req.nextUrl.clone();
      if (url.pathname === "/") {
        url.pathname = `/artist/${slug}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|demo/).*)"],
};
