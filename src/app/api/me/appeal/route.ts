import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { friendly500 } from "@/lib/api-error";

export const dynamic = "force-dynamic";

const appealSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "اكتب سبب الطعن بشكل واضح (10 حروف على الأقل)")
    .max(2000, "الكلام طويل أوي، اختصره شوية"),
});

// جلب كل طعون الفنان الحالي (عشان يشوف حالتها)
export async function GET() {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    const appeals = await db.appeal.findMany({
      where: { artistId: current.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ appeals });
  } catch (e) {
    console.error("MY_APPEALS_ERROR", e);
    return friendly500(e);
  }
}

// تقديم طعن جديد — للفنان الموقوف فقط
export async function POST(req: NextRequest) {
  try {
    const current = await getCurrentUser();
    if (!current) {
      return NextResponse.json({ error: "لازم تسجل دخول الأول" }, { status: 401 });
    }
    if (current.status !== "SUSPENDED") {
      return NextResponse.json(
        { error: "حسابك مش موقوف دلوقتي" },
        { status: 400 }
      );
    }

    const existing = await db.appeal.findFirst({
      where: { artistId: current.id, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json(
        { error: "عندك طعن قيد المراجعة بالفعل، استنى رد الإدارة" },
        { status: 409 }
      );
    }

    const parsed = appealSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "بيانات غير صحيحة" },
        { status: 400 }
      );
    }

    const appeal = await db.appeal.create({
      data: {
        artistId: current.id,
        message: parsed.data.message,
      },
    });

    return NextResponse.json({ appeal });
  } catch (e) {
    console.error("APPEAL_CREATE_ERROR", e);
    return friendly500(e);
  }
}
