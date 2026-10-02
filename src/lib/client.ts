"use client";

export async function api<T>(
  path: string,
  options?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(path, {
    method: options?.method || "GET",
    headers: options?.body !== undefined
      ? { "Content-Type": "application/json" }
      : undefined,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string })?.error || "حصلت مشكلة، جرّب تاني"
    );
  }
  return data as T;
}

/** Real-path navigation (works with App Router routes + subdomain rewrites) */
export function navigate(path: string) {
  window.location.assign(path);
}

/** Artist portfolio URL — صفحة جانبية ثابتة: <الدومين الحالي>/artist/slug */
export function artistUrl(slug: string): string {
  if (typeof window === "undefined") return `/artist/${slug}`;
  return `${window.location.origin}/artist/${slug}`;
}

/** WhatsApp deep link — converts local Egyptian numbers (01xx...) to intl format */
export function waLink(phone: string): string {
  let digits = (phone || "").replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "2" + digits;
  return `https://wa.me/${digits}`;
}

export function formatPrice(n: number): string {
  try {
    return new Intl.NumberFormat("ar-EG").format(n);
  } catch {
    return String(n);
  }
}

export function formatDate(s: string | Date): string {
  try {
    return new Intl.DateTimeFormat("ar-EG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(s));
  } catch {
    return String(s);
  }
}

