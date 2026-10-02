/** اسم البورتفوليو (slug) — بقاعدة: حروف إنجليزية صغيرة + أرقام + شرطة */

export const RESERVED_SLUGS = new Set([
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

export function normalizeSlug(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$/.test(slug) && !RESERVED_SLUGS.has(slug);
}
