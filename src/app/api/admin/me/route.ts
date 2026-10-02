import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    return NextResponse.json({
      admin: { id: current.id, name: current.name, phone: current.phone },
    });
  } catch {
    return friendly500(e);
  }
}

const putSchema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(80).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "كلمة السر الجديدة لازم 6 حروف على الأقل").max(100).optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current || current.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }
    const parsed = putSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }
    const { name, currentPassword, newPassword } = parsed.data;
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (newPassword) {
      if (!currentPassword || !verifyPassword(currentPassword, current.password)) {
        return NextResponse.json({ error: "كلمة السر الحالية غلط" }, { status: 400 });
      }
      data.password = hashPassword(newPassword);
    }
    await db.user.update({ where: { id: current.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("ADMIN_ME_PUT_ERROR", e);
    return friendly500(e);
  }
}
