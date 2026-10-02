import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current || current.role !== "ADMIN") return null;
  return current;
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    let settings = await db.siteSetting.findUnique({ where: { id: "main" } });
    if (!settings) {
      settings = await db.siteSetting.create({ data: { id: "main" } });
    }
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("ADMIN_SETTINGS_GET_ERROR", e);
    return friendly500(e);
  }
}

const putSchema = z.object({
  siteName: z.string().trim().min(1).max(60),
  tagline: z.string().trim().max(120),
  heroTitle: z.string().trim().max(120),
  heroSubtitle: z.string().trim().max(300),
  announcement: z.string().trim().max(200),
});

export async function PUT(req: NextRequest) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const parsed = putSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const settings = await db.siteSetting.upsert({
      where: { id: "main" },
      update: parsed.data,
      create: { id: "main", ...parsed.data },
    });
    return NextResponse.json({ settings });
  } catch (e) {
    console.error("ADMIN_SETTINGS_PUT_ERROR", e);
    return friendly500(e);
  }
}
