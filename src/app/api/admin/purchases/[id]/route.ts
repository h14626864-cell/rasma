import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
    }
    const purchase = await db.purchaseRequest.findUnique({ where: { id } });
    if (!purchase) {
      return NextResponse.json({ error: "مش موجود" }, { status: 404 });
    }
    const updated = await db.purchaseRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    if (parsed.data.status === "COMPLETED") {
      await db.artwork.update({
        where: { id: purchase.artworkId },
        data: { status: "SOLD" },
      });
    }
    return NextResponse.json({ purchase: updated });
  } catch (e) {
    console.error("ADMIN_PURCHASE_PATCH_ERROR", e);
    return friendly500(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const { id } = await params;
    const purchase = await db.purchaseRequest.findUnique({ where: { id } });
    if (!purchase) {
      return NextResponse.json({ error: "مش موجود" }, { status: 404 });
    }
    await db.purchaseRequest.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ADMIN_PURCHASE_DELETE_ERROR", e);
    return friendly500(e);
  }
}
