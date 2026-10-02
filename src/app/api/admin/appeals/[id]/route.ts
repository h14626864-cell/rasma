import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  adminNote: z.string().trim().max(500).optional(),
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
      return NextResponse.json({ error: "بيانات غير صحيحة" }, { status: 400 });
    }

    const appeal = await db.appeal.findUnique({ where: { id } });
    if (!appeal) {
      return NextResponse.json({ error: "الطعن مش موجود" }, { status: 404 });
    }
    if (appeal.status !== "PENDING") {
      return NextResponse.json(
        { error: "الطعن ده اتحسم بالفعل" },
        { status: 400 }
      );
    }

    const newStatus = parsed.data.action === "APPROVE" ? "APPROVED" : "REJECTED";

    const updated = await db.appeal.update({
      where: { id },
      data: { status: newStatus, adminNote: parsed.data.adminNote?.trim() || "" },
    });

    // لو الأدمن وافق على الطعن، بيرجع يفعّل حساب الفنان تلقائيًا
    if (parsed.data.action === "APPROVE") {
      await db.user.update({
        where: { id: appeal.artistId },
        data: { status: "ACTIVE", suspendReason: "" },
      });
    }

    return NextResponse.json({ appeal: updated });
  } catch (e) {
    console.error("ADMIN_APPEAL_PATCH_ERROR", e);
    return friendly500(e);
  }
}
