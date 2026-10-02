import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["AVAILABLE", "SOLD"]).optional(),
  featured: z.boolean().optional(),
});

async function requireAdmin() {
  const current = await getCurrentUser();
  if (!current || current.role !== "ADMIN") return null;
  return current;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }
    const artwork = await db.artwork.findUnique({ where: { id } });
    if (!artwork) {
      return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
    }
    const updated = await db.artwork.update({
      where: { id },
      data: parsed.data,
      select: { id: true, status: true, featured: true },
    });
    return NextResponse.json({ artwork: updated });
  } catch (e) {
    console.error("ADMIN_ARTWORK_PATCH_ERROR", e);
    return friendly500(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const { id } = await params;
    const artwork = await db.artwork.findUnique({ where: { id } });
    if (!artwork) {
      return NextResponse.json({ error: "اللوحة مش موجودة" }, { status: 404 });
    }
    await db.artwork.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ADMIN_ARTWORK_DELETE_ERROR", e);
    return friendly500(e);
  }
}
