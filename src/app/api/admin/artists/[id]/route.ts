import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  suspendReason: z.string().trim().max(500).optional(),
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
    const artist = await db.user.findUnique({ where: { id } });
    if (!artist || artist.role !== "ARTIST") {
      return NextResponse.json({ error: "الفنان مش موجود" }, { status: 404 });
    }

    const data: { status?: string; suspendReason?: string } = {};
    if (parsed.data.status === "SUSPENDED") {
      const reason = parsed.data.suspendReason?.trim();
      if (!reason) {
        return NextResponse.json(
          { error: "لازم تكتب سبب الحظر" },
          { status: 400 }
        );
      }
      data.status = "SUSPENDED";
      data.suspendReason = reason;
    } else if (parsed.data.status === "ACTIVE") {
      data.status = "ACTIVE";
      data.suspendReason = ""; // مسح السبب عند إعادة التنشيط
    }

    const updated = await db.user.update({
      where: { id },
      data,
      select: { id: true, status: true, suspendReason: true },
    });
    return NextResponse.json({ artist: updated });
  } catch (e) {
    console.error("ADMIN_ARTIST_PATCH_ERROR", e);
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
    const artist = await db.user.findUnique({ where: { id } });
    if (!artist || artist.role !== "ARTIST") {
      return NextResponse.json({ error: "الفنان مش موجود" }, { status: 404 });
    }
    await db.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ADMIN_ARTIST_DELETE_ERROR", e);
    return friendly500(e);
  }
}
